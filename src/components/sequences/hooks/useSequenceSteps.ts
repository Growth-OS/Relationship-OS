import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StepType, DatabaseStepType, SequenceStep, DatabaseSequenceStep, Sequence } from "../types";
import { toast } from "sonner";
import { addDays, format } from "date-fns";

// Helper functions for mapping step types
const mapDbStepTypeToFrontend = (dbType: DatabaseStepType, stepNumber: number): StepType => {
  if (dbType === "email") {
    return stepNumber === 1 ? "email_1" : "email_2";
  } else {
    if (stepNumber === 1) return "linkedin_connection";
    return stepNumber === 2 ? "linkedin_message_1" : "linkedin_message_2";
  }
};

const mapFrontendStepTypeToDb = (frontendType: StepType): DatabaseStepType => {
  return frontendType.startsWith('email') ? 'email' : 'linkedin';
};

export const useSequenceSteps = (sequenceId: string) => {
  const queryClient = useQueryClient();

  const { data: sequence, isLoading } = useQuery({
    queryKey: ["sequence", sequenceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sequences")
        .select(`
          *,
          sequence_steps (
            *
          )
        `)
        .eq("id", sequenceId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Sequence not found");

      // Map database step types to frontend step types
      if (data.sequence_steps) {
        data.sequence_steps = data.sequence_steps.map((step: DatabaseSequenceStep) => ({
          ...step,
          step_type: mapDbStepTypeToFrontend(step.step_type, step.step_number),
          message_template: step.message_template || "",
          delay_days: step.delay_days || 0,
        }));
      }

      return data as Sequence;
    },
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
        .maybeSingle();

      if (stepError) throw stepError;
      if (!stepData) throw new Error("Failed to create step");

      // Create a task for this step
      const dueDate = addDays(new Date(), values.delay_days);
      const actionType = values.step_type.startsWith('email') ? 'Send email' : 
                        values.step_type === 'linkedin_connection' ? 'Send LinkedIn connection request' : 
                        'Send LinkedIn message';
      
      const { error: taskError } = await supabase
        .from("tasks")
        .insert({
          title: `${actionType} for sequence "${sequence?.name}" - Step ${nextStepNumber}`,
          description: `Action required: ${values.message_template}`,
          due_date: format(dueDate, 'yyyy-MM-dd'),
          source: 'other',
          priority: 'medium',
          user_id: user.id
        });

      if (taskError) throw taskError;

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
      toast.success("Step added successfully and task created");
    },
    onError: (error) => {
      console.error("Error adding step:", error);
      toast.error("Failed to add step");
    },
  });

  return {
    sequence,
    isLoading,
    addStep: addStepMutation.mutate,
    isAddingStep: addStepMutation.isPending
  };
};