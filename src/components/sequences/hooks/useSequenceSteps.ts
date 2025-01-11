import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StepType, SequenceStep, Sequence } from "../types";
import { toast } from "sonner";
import { mapFrontendStepTypeToDb } from "../utils/stepTypeMapping";

export const useSequenceSteps = (sequenceId?: string) => {
  const queryClient = useQueryClient();

  const { data: sequence, isLoading, error } = useQuery({
    queryKey: ["sequence", sequenceId],
    queryFn: async () => {
      if (!sequenceId) {
        console.log('No sequence ID provided');
        return null;
      }

      console.log('Fetching sequence with ID:', sequenceId);
      
      const { data, error } = await supabase
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
        .eq("id", sequenceId)
        .eq("is_deleted", false)
        .maybeSingle();

      if (error) {
        console.error('Error fetching sequence:', error);
        throw error;
      }

      if (!data) {
        console.log('No sequence found with ID:', sequenceId);
        return null;
      }

      console.log('Sequence found:', data);

      const sequence: Sequence = {
        id: data.id,
        created_at: data.created_at,
        user_id: data.user_id,
        name: data.name,
        description: data.description,
        status: data.status,
        max_steps: data.max_steps,
        sequence_steps: data.sequence_steps || [],
        sequence_assignments: data.sequence_assignments || [],
      };

      return sequence;
    },
    enabled: Boolean(sequenceId),
    retry: false
  });

  const addStepMutation = useMutation({
    mutationFn: async (values: {
      step_type: StepType;
      message_template: string;
      delay_days: number;
    }) => {
      if (!sequenceId) throw new Error('No sequence ID provided');

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User must be authenticated to create steps');

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
      if (!stepData) throw new Error("Failed to create step");

      return stepData as SequenceStep;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sequence", sequenceId] });
      toast.success("Step added successfully");
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