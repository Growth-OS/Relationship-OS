import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useGmailMessages = () => {
  return useQuery({
    queryKey: ['emails'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const webhookUrl = localStorage.getItem('make_webhook_url');
      if (!webhookUrl) {
        toast.error('Make.com webhook URL not configured');
        throw new Error('Make.com webhook URL not configured');
      }

      console.log('Fetching emails from Make.com webhook...');
      const response = await fetch(webhookUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Make.com webhook error:', errorText);
        throw new Error(`Failed to fetch messages: ${errorText}`);
      }

      const data = await response.json();
      console.log('Received emails from Make.com:', data);

      return data.messages || [];
    },
    retry: 1,
    meta: {
      onError: (error: Error) => {
        console.error('Email fetch error:', error);
        toast.error('Failed to fetch emails: ' + error.message);
      }
    }
  });
};