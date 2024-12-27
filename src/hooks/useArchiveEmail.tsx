import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useArchiveEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const webhookUrl = localStorage.getItem('make_webhook_url_archive');
      const webhookApiKey = localStorage.getItem('make_webhook_api_key');

      if (!webhookUrl) {
        toast.error('Make.com archive webhook URL not configured');
        throw new Error('Make.com archive webhook URL not configured');
      }

      if (!webhookApiKey) {
        toast.error('Make.com webhook API key not configured');
        throw new Error('Make.com webhook API key not configured');
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': webhookApiKey,
          'X-Request-ID': crypto.randomUUID(),
          'X-Rate-Limit': 'true',
        },
        body: JSON.stringify({ messageId }),
      });

      if (!response.ok) throw new Error('Failed to archive message');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast.success('Message archived');
    },
    onError: () => {
      toast.error('Failed to archive message');
    },
  });
};