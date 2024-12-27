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
    body?: {
      data?: string;
    };
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
      console.log('Webhook URL:', webhookUrl);
      
      const response = await fetch(webhookUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': webhookApiKey,
          'X-Request-ID': crypto.randomUUID(),
          'X-Rate-Limit': 'true',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Make.com webhook error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          headers: Object.fromEntries(response.headers.entries())
        });
        throw new Error(`Failed to fetch messages: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Raw response from Make.com:', data);
      
      if (!Array.isArray(data.messages)) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format: messages array not found');
      }

      console.log('Processing messages from Make.com...');

      const messages: EmailMessage[] = data.messages?.map((message: any) => {
        // Create a snippet from the raw body if no snippet is provided
        let emailSnippet = message.snippet;
        if (!emailSnippet && message.body) {
          // If the body is base64 encoded, decode it
          try {
            const decodedBody = atob(message.body.replace(/-/g, '+').replace(/_/g, '/'));
            emailSnippet = decodedBody.substring(0, 200) + '...';
          } catch (e) {
            // If decoding fails, use the raw body
            emailSnippet = message.body.substring(0, 200) + '...';
          }
        }

        return {
          id: message.id || String(Math.random()),
          snippet: emailSnippet || message.body || message.content || 'No preview available',
          payload: {
            headers: [
              { 
                name: 'From', 
                value: message.from || 'Unknown Sender',
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
                ...(message.date && isNaN(Date.parse(message.date)) && {
                  value: new Date().toISOString()
                })
              }
            ],
            body: {
              data: message.body || ''
            }
          },
          labelIds: Array.isArray(message.labels) ? message.labels : ['INBOX']
        };
      }).filter(Boolean) || [];

      console.log('Processed messages:', messages);
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