import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EmailMessage {
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

      const makeHttpUrl = localStorage.getItem('make_http_url');
      const makeApiKey = localStorage.getItem('make_api_key');

      if (!makeHttpUrl) {
        toast.error('Make.com HTTP URL not configured');
        throw new Error('Make.com HTTP URL not configured');
      }

      if (!makeApiKey) {
        toast.error('Make.com API key not configured');
        throw new Error('Make.com API key not configured');
      }

      console.log('Fetching emails from Make.com...');
      
      const response = await fetch(makeHttpUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${makeApiKey}`,
          'X-Request-ID': crypto.randomUUID()
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Make.com error:', {
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