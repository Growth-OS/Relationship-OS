import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSequenceOperations = () => {
  const queryClient = useQueryClient();

  const handleStatusChange = async (sequenceId: string, newStatus: 'active' | 'paused') => {
    try {
      console.log('Updating sequence status:', { sequenceId, newStatus });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to update sequences');
        return;
      }

      const { error } = await supabase
        .from('sequences')
        .update({ status: newStatus })
        .eq('id', sequenceId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating sequence status:', error);
        throw error;
      }

      const { data: verifySequence, error: verifyError } = await supabase
        .from('sequences')
        .select('*')
        .eq('id', sequenceId)
        .single();

      if (verifyError) {
        console.error('Verification error:', verifyError);
        throw verifyError;
      }

      console.log('Verified sequence update:', verifySequence);

      toast.success(`Sequence ${newStatus === 'active' ? 'activated' : 'paused'} successfully`);
      await queryClient.invalidateQueries({ queryKey: ['sequences'] });
    } catch (error) {
      console.error('Error updating sequence status:', error);
      toast.error('Failed to update sequence status');
    }
  };

  const handleDelete = async (sequenceId: string) => {
    try {
      console.log('Starting sequence deletion process for ID:', sequenceId);

      // First, delete all sequence history records
      const { error: historyError } = await supabase
        .from('sequence_history')
        .delete()
        .eq('assignment_id', (
          supabase
            .from('sequence_assignments')
            .select('id')
            .eq('sequence_id', sequenceId)
        ));

      if (historyError) {
        console.error('Error deleting sequence history:', historyError);
        toast.error(`Failed to delete sequence history: ${historyError.message}`);
        return;
      }

      // Then, delete all sequence assignments
      const { error: assignmentsError } = await supabase
        .from('sequence_assignments')
        .delete()
        .eq('sequence_id', sequenceId);

      if (assignmentsError) {
        console.error('Error deleting sequence assignments:', assignmentsError);
        toast.error(`Failed to delete sequence assignments: ${assignmentsError.message}`);
        return;
      }

      // Next, delete all sequence steps
      const { error: stepsError } = await supabase
        .from('sequence_steps')
        .delete()
        .eq('sequence_id', sequenceId);

      if (stepsError) {
        console.error('Error deleting sequence steps:', stepsError);
        toast.error(`Failed to delete sequence steps: ${stepsError.message}`);
        return;
      }

      // Finally, delete the sequence itself
      const { error: sequenceError } = await supabase
        .from('sequences')
        .delete()
        .eq('id', sequenceId);

      if (sequenceError) {
        console.error('Error deleting sequence:', sequenceError);
        toast.error(`Failed to delete sequence: ${sequenceError.message}`);
        return;
      }

      toast.success('Sequence deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['sequences'] });
    } catch (error) {
      console.error('Error in deletion process:', error);
      if (error instanceof Error) {
        toast.error(`Failed to delete sequence: ${error.message}`);
      } else {
        toast.error('Failed to delete sequence. Please try again.');
      }
    }
  };

  return {
    handleStatusChange,
    handleDelete
  };
};