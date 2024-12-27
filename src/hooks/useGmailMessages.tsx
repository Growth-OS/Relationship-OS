import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  body?: string;
}

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
        console.error('Make.com webhook error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received response from Make.com:', data);
      
      return data.messages || [];
    },
    meta: {
      onError: (error: Error) => {
        console.error('Email fetch error:', error);
        toast.error('Failed to fetch emails: ' + error.message);
      }
    }
  });
};