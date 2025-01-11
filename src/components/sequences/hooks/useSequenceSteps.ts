import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StepType, DatabaseStepType, SequenceStep, DatabaseSequenceStep, Sequence } from "../types";
import { TaskSource } from "@/integrations/supabase/types/tasks";
import { toast } from "sonner";
import { addDays, format } from "date-fns";
import { mapDbStepTypeToFrontend, mapFrontendStepTypeToDb } from "../utils/stepTypeMapping";

export const useSequenceSteps = (sequenceId: string) => {
  const queryClient = useQueryClient();

  const { data: sequence, isLoading, error } = useQuery({
    queryKey: ["sequence", sequenceId],
    queryFn: async () => {
      console.log('Fetching sequence with ID:', sequenceId);
      
      let query = supabase
        .from("sequences")
        .select(`
          *,
          sequence_steps (
            *
          ),
          sequence_assignments (
            id,
            status,
            current_step,
            prospect:prospects (
              company_name,
              contact_email,
              contact_linkedin,
              contact_job_title
            )
          )
        `)
        .eq("is_deleted", false);

      // Only add the ID condition if sequenceId is defined
      if (sequenceId) {
        query = query.eq("id", sequenceId);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error('Error fetching sequence:', error);
        throw error;
      }

      if (!data) {
        console.log('No sequence found with ID:', sequenceId);
        return null;
      }

      console.log('Sequence found:', data);

      // Convert database steps to frontend steps
      const frontendSteps = data.sequence_steps?.map((step: DatabaseSequenceStep): SequenceStep => ({
        id: step.id,
        step_number: step.step_number,
        step_type: mapDbStepTypeToFrontend(step.step_type, step.step_number),
        message_template: step.message_template || "",
        delay_days: step.delay_days || 0,
        count: step.count
      })) || [];

      const sequence: Sequence = {
        id: data.id,
        created_at: data.created_at,
        user_id: data.user_id,
        name: data.name,
        description: data.description,
        status: data.status,
        max_steps: data.max_steps,
        sequence_steps: frontendSteps,
        sequence_assignments: data.sequence_assignments || [],
      };

      return sequence;
    },
    enabled: Boolean(sequenceId), // Only run query if sequenceId is provided and is truthy
  });

  const addStepMutation = useMutation({
    mutationFn: async (values: {
      step_type: StepType;
      message_template: string;
      delay_days: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be authenticated to create steps');
      }

      const nextStepNumber = sequence?.sequence_steps?.length + 1 || 1;
      const dbStepType = mapFrontendStepTypeToDb(values.step_type);

      // Create the sequence step
      const { data: stepData, error: stepError } = await supabase
        .from("sequence_steps")
        .insert({
          sequence_id: sequenceId,
          step_number: nextStepNumber,
          step_type: dbStepType,
          message_template: values.message_template,
          delay_days: values.delay_days,
        })
        .select()
        .single();

      if (stepError) throw stepError;
      if (!stepData) throw new Error("Failed to create step");

      // Get all active assignments for this sequence
      const { data: assignments, error: assignmentsError } = await supabase
        .from("sequence_assignments")
        .select(`
          id,
          prospect:prospects (
            company_name,
            contact_email,
            contact_linkedin,
            contact_job_title
          )
        `)
        .eq("sequence_id", sequenceId)
        .eq("status", "active");

      if (assignmentsError) throw assignmentsError;
      
      // Create tasks for each prospect in the sequence
      if (assignments && assignments.length > 0) {
        const tasks = assignments.map(assignment => {
          const dueDate = addDays(new Date(), values.delay_days);
          const actionType = values.step_type.startsWith('email') ? 'Send email' : 
                          values.step_type === 'linkedin_connection' ? 'Send LinkedIn connection request' : 
                          'Send LinkedIn message';
          
          const prospectInfo = assignment.prospect;
          const contactMethod = values.step_type.startsWith('email') ? 
            `(${prospectInfo.contact_email})` : 
            `(${prospectInfo.contact_linkedin})`;

          return {
            title: `${actionType} to ${prospectInfo.company_name} - ${prospectInfo.contact_job_title} ${contactMethod} - Step ${nextStepNumber}`,
            description: `Action required for ${prospectInfo.company_name}:\n\n${values.message_template}`,
            due_date: format(dueDate, 'yyyy-MM-dd'),
            source: 'other' as TaskSource,
            priority: 'medium',
            user_id: user.id
          };
        });

        // Insert all tasks at once
        const { error: tasksError } = await supabase
          .from("tasks")
          .insert(tasks);

        if (tasksError) {
          console.error("Error creating tasks:", tasksError);
          throw tasksError;
        }
      }

      return {
        id: stepData.id,
        step_number: stepData.step_number,
        step_type: mapDbStepTypeToFrontend(stepData.step_type as DatabaseStepType, stepData.step_number),
        message_template: stepData.message_template || "",
        delay_days: stepData.delay_days || 0,
      } as SequenceStep;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sequence", sequenceId] });
      toast.success("Step added successfully and tasks created");
    },
    onError: (error) => {
      console.error("Error adding step:", error);
      toast.error("Failed to add step");
    },
  });

  return {
    sequence,
    isLoading,
    error,
    addStep: addStepMutation.mutate,
    isAddingStep: addStepMutation.isPending
  };
};