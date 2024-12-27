import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SendEmailParams {
  to: string;
  subject: string;
  content: string;
}

export const useEmailMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ to, subject, content }: SendEmailParams) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const webhookUrl = localStorage.getItem('make_webhook_url_send');
      const webhookApiKey = localStorage.getItem('make_webhook_api_key');

      if (!webhookUrl) {
        throw new Error('Make.com webhook URL for sending emails not configured');
      }

      if (!webhookApiKey) {
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
        body: JSON.stringify({
          to,
          subject,
          content,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send email: ${errorText}`);
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Email sent successfully');
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
    onError: (error: Error) => {
      console.error('Error sending email:', error);
      toast.error(error.message);
    },
  });
};