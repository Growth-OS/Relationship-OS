import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useStarEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, isStarred }: { messageId: string; isStarred: boolean }) => {
      const { error } = await supabase
        .from('emails')
        .update({ is_starred: isStarred })
        .eq('message_id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
  });
};

export const useSnoozeEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, snoozeUntil }: { messageId: string; snoozeUntil: Date }) => {
      const { error } = await supabase
        .from('emails')
        .update({ snoozed_until: snoozeUntil.toISOString() })
        .eq('message_id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast.success('Email snoozed');
    },
  });
};

export const useTrashEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
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
  });
};