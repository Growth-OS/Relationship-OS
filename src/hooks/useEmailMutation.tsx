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

      console.log('Sending test email to Zapier webhook...');
      
      try {
        const response = await fetch('https://hooks.zapier.com/hooks/catch/20724321/28z9bpa/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'no-cors',
          body: JSON.stringify({
            to: "test@example.com", // Test recipient
            subject: "Test Email from GrowthOS",
            content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1>This is a test email</h1>
              <p>Testing Zapier webhook integration</p>
              <p>Timestamp: ${new Date().toISOString()}</p>
            </div>`,
            user_id: session.user.id,
            reply_to_message_id: replyToMessageId,
            timestamp: new Date().toISOString(),
          }),
        });

        // With no-cors mode, we won't get response details
        // Instead, we'll assume success if no error was thrown
        console.log('Webhook request completed');
        return true;
      } catch (error) {
        console.error('Error sending to webhook:', error);
        throw new Error('Failed to send email through webhook');
      }
    },
    onSuccess: () => {
      toast.success('Test email sent successfully');
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
    onError: (error: Error) => {
      console.error('Error sending email:', error);
      toast.error(error.message);
    },
  });
};