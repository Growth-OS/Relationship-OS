import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { LinkedInMessage } from '@/integrations/supabase/types/linkedin';

export const useLinkedInMessages = () => {
  const queryClient = useQueryClient();

  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['linkedin-messages'],
    queryFn: async () => {
      console.log('Fetching LinkedIn messages...');
      
      // First, sync messages from Unipile
      const { data: syncData, error: syncError } = await supabase.functions.invoke('unipile-linkedin', {
        body: { action: 'getMessages' }
      });

      if (syncError) {
        console.error('Error syncing messages from Unipile:', syncError);
        throw syncError;
      }
      
      console.log('Sync completed, messages synced:', syncData?.count || 0);

      // Then fetch from our local database
      const { data, error } = await supabase
        .from('linkedin_messages')
        .select('*')
        .order('received_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages from database:', error);
        throw error;
      }

      console.log('Messages fetched from database:', data?.length || 0, 'messages found');
      return data || [];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Show error toast if there's an error
  if (error) {
    console.error('Error in useLinkedInMessages:', error);
    toast.error('Failed to load LinkedIn messages');
  }

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
    error,
    sendMessage,
  };
};