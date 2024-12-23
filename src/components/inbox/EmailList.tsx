import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Archive, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

interface EmailListProps {
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string | null) => void;
}

export const EmailList = ({ selectedMessageId, setSelectedMessageId }: EmailListProps) => {
  const queryClient = useQueryClient();

  const { data: messages, isLoading: isLoadingMessages, error: messagesError } = useQuery({
    queryKey: ['emails'],
    queryFn: async () => {
      console.log('Starting to fetch emails...');
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // First check if we have a Google connection
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

  const archiveMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch('/functions/v1/gmail', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'archiveMessage',
          messageId 
        }),
      });

      if (!response.ok) throw new Error('Failed to archive message');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      toast.success('Message archived');
    },
    onError: () => {
      toast.error('Failed to archive message');
    },
  });

  const getHeader = (message: EmailMessage, headerName: string) => {
    return message.payload.headers.find(h => h.name.toLowerCase() === headerName.toLowerCase())?.value;
  };

  if (isLoadingMessages) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (messagesError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-red-500 mb-4">
          {messagesError instanceof Error ? messagesError.message : 'Failed to load emails'}
        </p>
        <Button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['emails'] })}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!messages?.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No emails found
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="divide-y">
        {messages?.map((message: EmailMessage) => (
          <div 
            key={message.id}
            className="p-4 hover:bg-gray-50 cursor-pointer relative group"
            onClick={() => setSelectedMessageId(selectedMessageId === message.id ? null : message.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {getHeader(message, 'From')}
                </p>
                <p className="text-sm font-medium truncate">
                  {getHeader(message, 'Subject')}
                </p>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {message.snippet}
                </p>
                {selectedMessageId === message.id && (
                  <div className="mt-4 text-sm text-gray-600">
                    {message.snippet}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {new Date(getHeader(message, 'Date')).toLocaleString()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    archiveMutation.mutate(message.id);
                  }}
                >
                  <Archive className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};