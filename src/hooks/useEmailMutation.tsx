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
    mutationFn: async ({ to, subject, content }: SendEmailParams) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      console.log('Preparing to send new email...');
      console.log('Email content:', content);
      
      const webhookUrl = 'https://hooks.zapier.com/hooks/catch/20724321/28z9bpa/';
      console.log('Using webhook:', webhookUrl);

      const payload = {
        to,
        subject,
        body: content,
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          ${content}
        </div>`,
        user_id: session.user.id,
        timestamp: new Date().toISOString()
      };

      console.log('Sending payload:', payload);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(payload),
      });

      console.log('Email request sent successfully');
      return true;
    },
    onSuccess: () => {
      toast.success('Email sent successfully');
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
    onError: (error: Error) => {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    },
  });
};