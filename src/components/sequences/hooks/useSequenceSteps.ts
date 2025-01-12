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

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Authentication required");
        throw new Error("Not authenticated");
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
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching sequence:', error);
        toast.error("Failed to load sequence");
        throw error;
      }

      if (!data) {
        console.log('No sequence found with ID:', sequenceId);
        return null;
      }

      console.log('Sequence found:', data);
      return data as Sequence;
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
      if (!sequenceId) {
        toast.error("No sequence ID provided");
        throw new Error('No sequence ID provided');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Authentication required");
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

      if (stepError) {
        console.error('Error adding step:', stepError);
        toast.error("Failed to add step");
        throw stepError;
      }
      
      if (!stepData) {
        toast.error("Failed to create step");
        throw new Error("Failed to create step");
      }

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