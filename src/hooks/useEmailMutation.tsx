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

      console.log('Preparing to send email...', replyToMessageId ? 'Reply' : 'New email');
      
      try {
        // Use different webhook URLs based on whether it's a reply or new email
        const webhookUrl = replyToMessageId 
          ? 'https://hooks.zapier.com/hooks/catch/20724321/28z9bpa/reply'  // Replace with your reply webhook
          : 'https://hooks.zapier.com/hooks/catch/20724321/28z9bpa/';      // Your existing webhook for new emails

        console.log('Using webhook:', webhookUrl);

        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'no-cors',
          body: JSON.stringify({
            to,
            subject,
            content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              ${content}
            </div>`,
            user_id: session.user.id,
            reply_to_message_id: replyToMessageId,
            timestamp: new Date().toISOString(),
            is_reply: !!replyToMessageId
          }),
        });

        console.log('Email request sent successfully');
        return true;
      } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email through webhook');
      }
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