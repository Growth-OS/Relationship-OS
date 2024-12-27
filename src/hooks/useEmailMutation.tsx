import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SendEmailParams {
  to: string;
  subject: string;
  content: string;
  replyToMessageId?: string;
}

export const useEmailMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ to, subject, content, replyToMessageId }: SendEmailParams) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // Call Zapier webhook to send email
      const response = await fetch('https://hooks.zapier.com/hooks/catch/20724321/28z9bpa/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          to,
          subject: replyToMessageId ? `Re: ${subject}` : subject,
          content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            ${content.split('\n').map(line => `<p style="margin: 1em 0;">${line}</p>`).join('')}
          </div>`,
          user_id: session.user.id,
          reply_to_message_id: replyToMessageId,
          timestamp: new Date().toISOString(),
        }),
      });

      return response;
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