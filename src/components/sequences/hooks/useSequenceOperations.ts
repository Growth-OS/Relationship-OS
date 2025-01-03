import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { deleteSequenceTasks } from '../utils/sequenceTaskUtils';

export const useSequenceOperations = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const deleteSequence = async (sequenceId: string, sequenceName: string) => {
    setIsDeleting(true);
    try {
      // First delete all related tasks
      await deleteSequenceTasks(sequenceName);

      // Delete sequence history records
      const { error: historyError } = await supabase
        .from('sequence_history')
        .delete()
        .eq('assignment_id', supabase
          .from('sequence_assignments')
          .select('id')
          .eq('sequence_id', sequenceId)
        );

      if (historyError) {
        console.error('Failed to delete sequence history:', historyError);
        toast.error('Failed to delete sequence history');
        return;
      }

      // Delete sequence assignments
      const { error: assignmentsError } = await supabase
        .from('sequence_assignments')
        .delete()
        .eq('sequence_id', sequenceId);

      if (assignmentsError) {
        console.error('Failed to delete sequence assignments:', assignmentsError);
        toast.error('Failed to delete sequence assignments');
        return;
      }

      // Delete sequence steps
      const { error: stepsError } = await supabase
        .from('sequence_steps')
        .delete()
        .eq('sequence_id', sequenceId);

      if (stepsError) {
        console.error('Failed to delete sequence steps:', stepsError);
        toast.error('Failed to delete sequence steps');
        return;
      }

      // Finally delete the sequence itself
      const { error: sequenceError } = await supabase
        .from('sequences')
        .delete()
        .eq('id', sequenceId);

      if (sequenceError) {
        console.error('Failed to delete sequence:', sequenceError);
        toast.error('Failed to delete sequence');
        return;
      }

      queryClient.invalidateQueries({ queryKey: ['sequences'] });
      toast.success('Sequence deleted successfully');
    } catch (error) {
      console.error('Error in sequence deletion:', error);
      toast.error('Failed to delete sequence');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteSequence,
    isDeleting
  };
};