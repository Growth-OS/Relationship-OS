import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useStarEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, isStarred }: { messageId: string; isStarred: boolean }) => {
      console.log('Starring email:', messageId, isStarred);
      const { error } = await supabase
        .from('emails')
        .update({ is_starred: isStarred })
        .eq('message_id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
    onError: (error) => {
      console.error('Error starring email:', error);
      toast.error('Failed to star email');
    }
  });
};

export const useSnoozeEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, snoozeUntil }: { messageId: string; snoozeUntil: Date }) => {
      console.log('Snoozing email:', messageId, 'until:', snoozeUntil);
      const { error } = await supabase
        .from('emails')
        .update({ snoozed_until: snoozeUntil.toISOString() })
        .eq('message_id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
    onError: (error) => {
      console.error('Error snoozing email:', error);
      throw error; // Let the component handle the error
    }
  });
};

export const useTrashEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      console.log('Trashing email:', messageId);
      const { error } = await supabase
        .from('emails')
        .update({ is_trashed: true })
        .eq('message_id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast.success('Email moved to trash');
    },
    onError: (error) => {
      console.error('Error trashing email:', error);
      toast.error('Failed to move email to trash');
    }
  });
};