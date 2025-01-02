import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StepType } from "../types";
import { toast } from "sonner";
import { addDays, format } from "date-fns";
import { mapDbStepTypeToFrontend, mapFrontendStepTypeToDb, type DatabaseStepType } from "../utils/stepTypeMapping";

interface DatabaseSequenceStep {
  id: string;
  sequence_id: string;
  step_number: number;
  step_type: DatabaseStepType;
  message_template: string;
  delay_days: number;
}

interface Sequence {
  id: string;
  name: string;
  sequence_steps?: DatabaseSequenceStep[];
}

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
        .single();

      if (error) throw error;

      // Map database step types to frontend step types
      if (data.sequence_steps) {
        data.sequence_steps = data.sequence_steps.map((step: DatabaseSequenceStep) => ({
          id: step.id,
          step_number: step.step_number,
          step_type: mapDbStepTypeToFrontend(step.step_type, step.step_number),
          message_template: step.message_template,
          delay_days: step.delay_days,
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
        .single();

      if (stepError) throw stepError;

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
        step_type: mapDbStepTypeToFrontend(dbStepType, nextStepNumber),
        message_template: stepData.message_template,
        delay_days: stepData.delay_days,
      };
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