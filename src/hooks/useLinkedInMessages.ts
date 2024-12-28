import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { LinkedInMessage } from '@/integrations/supabase/types/linkedin';

export const useLinkedInMessages = () => {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['linkedin-messages'],
    queryFn: async () => {
      // First, sync messages from Unipile
      await supabase.functions.invoke('unipile-linkedin', {
        body: { action: 'getMessages' }
      });

      // Then fetch from our local database
      const { data, error } = await supabase
        .from('linkedin_messages')
        .select('*')
        .order('received_at', { ascending: false });

      if (error) throw error;
      return data as LinkedInMessage[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const sendMessage = useMutation({
    mutationFn: async ({ threadId, content }: { threadId: string, content: string }) => {
      const { data, error } = await supabase.functions.invoke('unipile-linkedin', {
        body: {
          action: 'sendMessage',
          messageId: threadId,
          content,
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-messages'] });
      toast.success('Message sent successfully');
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    },
  });

  return {
    messages,
    isLoading,
    sendMessage,
  };
};