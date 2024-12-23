import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useGmailMessages = () => {
  return useQuery({
    queryKey: ['emails'],
    queryFn: async () => {
      console.log('Starting to fetch emails...');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data: connection, error: connectionError } = await supabase
        .from('oauth_connections')
        .select('*')
        .eq('provider', 'google')
        .maybeSingle();

      console.log('OAuth connection check:', connection, connectionError);

      if (connectionError) {
        console.error('Connection error:', connectionError);
        throw new Error('Failed to check Google connection');
      }

      if (!connection) {
        throw new Error('No Google connection found');
      }

      const response = await fetch('/functions/v1/gmail', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'listMessages' }),
      });

      console.log('Gmail API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gmail API error:', errorText);
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      console.log('Gmail API response data:', data);
      
      if (!data.messages || !Array.isArray(data.messages)) {
        console.error('Unexpected response format:', data);
        throw new Error('Invalid response format from Gmail API');
      }

      const messageDetails = await Promise.all(
        data.messages.map(async (message: { id: string }) => {
          const detailResponse = await fetch('/functions/v1/gmail', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              action: 'getMessage',
              messageId: message.id 
            }),
          });
          
          if (!detailResponse.ok) {
            console.error('Failed to fetch message details:', message.id);
            throw new Error('Failed to fetch message details');
          }
          return detailResponse.json();
        })
      );

      return messageDetails;
    },
  });
};