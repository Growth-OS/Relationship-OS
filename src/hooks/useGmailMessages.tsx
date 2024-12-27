import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EmailMessage {
  id: string;
  snippet: string;
  payload: {
    headers: {
      name: string;
      value: string;
    }[];
  };
  labelIds: string[];
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
      const webhookApiKey = localStorage.getItem('make_webhook_api_key');
      
      if (!webhookUrl) {
        toast.error('Make.com webhook URL not configured');
        throw new Error('Make.com webhook URL not configured');
      }

      if (!webhookApiKey) {
        toast.error('Make.com webhook API key not configured');
        throw new Error('Make.com webhook API key not configured');
      }

      console.log('Fetching emails from Make.com webhook...');
      const response = await fetch(webhookUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': webhookApiKey,
          'X-Request-ID': crypto.randomUUID(), // For request deduplication
          'X-Rate-Limit': 'true', // Custom header for Make.com rate limiting
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Make.com webhook error:', errorText);
        throw new Error(`Failed to fetch messages: ${errorText}`);
      }

      const data = await response.json();
      
      // Validate response data structure
      if (!Array.isArray(data.messages)) {
        throw new Error('Invalid response format: messages array not found');
      }

      console.log('Received emails from Make.com:', data);

      // Transform and validate each message
      const messages: EmailMessage[] = data.messages?.map((message: any) => {
        // Validate required fields
        if (!message.id || (!message.snippet && !message.body && !message.content)) {
          console.warn('Invalid message format:', message);
          return null;
        }

        return {
          id: message.id || String(Math.random()),
          snippet: message.snippet || message.body || message.content || '',
          payload: {
            headers: [
              { 
                name: 'From', 
                value: message.from || 'Unknown Sender',
                // Validate email format
                ...(message.from && !message.from.includes('@') && {
                  value: `${message.from} <no-reply@unknown.com>`
                })
              },
              { 
                name: 'Subject', 
                value: message.subject || 'No Subject' 
              },
              { 
                name: 'Date', 
                value: message.date || new Date().toISOString(),
                // Validate date format
                ...(message.date && isNaN(Date.parse(message.date)) && {
                  value: new Date().toISOString()
                })
              }
            ]
          },
          labelIds: Array.isArray(message.labels) ? message.labels : ['INBOX']
        };
      }).filter(Boolean) || []; // Remove any null values from invalid messages

      return messages;
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