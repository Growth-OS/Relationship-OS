import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSequenceTaskOperations } from "./useSequenceTaskOperations";

export const useSequenceOperations = () => {
  const queryClient = useQueryClient();
  const { createSequenceTasks } = useSequenceTaskOperations();

  const deleteMutation = useMutation({
    mutationFn: async ({ sequenceId, sequenceName }: { sequenceId: string, sequenceName: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      console.log("Deleting sequence:", sequenceId, sequenceName);

      // First verify the sequence belongs to the user
      const { data: sequence, error: sequenceError } = await supabase
        .from("sequences")
        .select("*")
        .eq("id", sequenceId)
        .eq("user_id", user.id)
        .eq("is_deleted", false)
        .single();

      if (sequenceError) {
        console.error("Error verifying sequence ownership:", sequenceError);
        throw sequenceError;
      }

      if (!sequence) {
        throw new Error("Sequence not found or unauthorized");
      }

      // Use a single transaction for all updates
      const { error: updateError } = await supabase.rpc('delete_sequence', {
        p_sequence_id: sequenceId,
        p_user_id: user.id
      } as {
        p_sequence_id: string;
        p_user_id: string;
      });

      if (updateError) {
        console.error("Error in sequence deletion transaction:", updateError);
        throw updateError;
      }

      return { sequenceId, sequenceName };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sequences"] });
      queryClient.invalidateQueries({ queryKey: ["weekly-tasks"] });
      toast.success("Sequence deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting sequence:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete sequence");
    }
  });

  const assignProspectMutation = useMutation({
    mutationFn: async ({ 
      sequenceId, 
      prospectId 
    }: { 
      sequenceId: string; 
      prospectId: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check if prospect is already assigned to this sequence
      const { data: existingAssignment } = await supabase
        .from("sequence_assignments")
        .select("*")
        .eq("sequence_id", sequenceId)
        .eq("prospect_id", prospectId)
        .maybeSingle();

      if (existingAssignment) {
        throw new Error("Prospect is already assigned to this sequence");
      }

      // First, get the sequence details and steps
      const { data: sequence, error: sequenceError } = await supabase
        .from("sequences")
        .select(`
          *,
          sequence_steps (*)
        `)
        .eq("id", sequenceId)
        .eq("user_id", user.id) // Ensure we only get user's own sequence
        .single();

      if (sequenceError) throw sequenceError;

      // Get prospect details
      const { data: prospect, error: prospectError } = await supabase
        .from("prospects")
        .select("*")
        .eq("id", prospectId)
        .eq("user_id", user.id) // Ensure we only get user's own prospect
        .single();

      if (prospectError) throw prospectError;

      // Create the sequence assignment
      const { data: assignment, error: assignmentError } = await supabase
        .from("sequence_assignments")
        .insert({
          sequence_id: sequenceId,
          prospect_id: prospectId,
          status: "active",
          current_step: 1
        })
        .select()
        .single();

      if (assignmentError) throw assignmentError;

      console.log("Creating tasks for sequence:", sequence.name);
      console.log("Steps:", sequence.sequence_steps);
      console.log("Prospect:", prospect);

      // Create tasks for each step
      await createSequenceTasks(sequence.id, prospectId, sequence.sequence_steps, prospect, user);

      return assignment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sequences"] });
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
      queryClient.invalidateQueries({ queryKey: ["weekly-tasks"] });
      toast.success("Prospect assigned to sequence successfully");
    },
    onError: (error) => {
      console.error("Error assigning prospect:", error);
      if (error instanceof Error && error.message === "Prospect is already assigned to this sequence") {
        toast.error("This prospect is already assigned to this sequence");
      } else {
        toast.error("Failed to assign prospect to sequence");
      }
    }
  });

  return {
    deleteSequence: (sequenceId: string, sequenceName: string) => 
      deleteMutation.mutateAsync({ sequenceId, sequenceName }),
    assignProspect: assignProspectMutation.mutate,
    isAssigning: assignProspectMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};