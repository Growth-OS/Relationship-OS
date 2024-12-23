import { useEffect, useState } from "react";
import { Mail, Archive, Trash2, Clock, Star, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

const Inbox = () => {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: connection, isLoading: isCheckingConnection } = useQuery({
    queryKey: ['googleConnection'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('oauth_connections')
        .select('*')
        .eq('provider', 'google')
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['emails'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch('/functions/v1/gmail', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'listMessages' }),
      });

      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const data = await response.json();
      
      // Fetch full message details for each message
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
          
          if (!detailResponse.ok) throw new Error('Failed to fetch message details');
          return detailResponse.json();
        })
      );

      return messageDetails;
    },
    enabled: !!connection,
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

  const handleGoogleAuth = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/gmail.modify',
          redirectTo: `${window.location.origin}/dashboard/inbox`,
        },
      });

      if (error) throw error;
      toast.success('Successfully connected to Gmail');
    } catch (error) {
      console.error('Google auth error:', error);
      toast.error('Failed to connect to Gmail');
    }
  };

  const getHeader = (message: EmailMessage, headerName: string) => {
    return message.payload.headers.find(h => h.name.toLowerCase() === headerName.toLowerCase())?.value;
  };

  if (isCheckingConnection) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!connection) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Inbox</h1>
          <p className="text-gray-600">Manage your emails efficiently</p>
        </div>

        <Card className="p-6 text-center space-y-4">
          <h2 className="text-xl font-semibold">Connect Your Gmail Account</h2>
          <p className="text-gray-600">
            Connect your Gmail account to start managing your emails directly from Growth OS
          </p>
          <Button onClick={handleGoogleAuth} size="lg">
            Connect Gmail
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Inbox</h1>
        <p className="text-gray-600">Manage your emails efficiently</p>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
        <Card className="col-span-3 p-4">
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Inbox
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Star className="mr-2 h-4 w-4" />
              Starred
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Clock className="mr-2 h-4 w-4" />
              Snoozed
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Archive className="mr-2 h-4 w-4" />
              Archived
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Trash
            </Button>
          </div>
        </Card>

        <Card className="col-span-9 p-0 flex flex-col">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Search emails..."
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <ScrollArea className="flex-1">
            {isLoadingMessages ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
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
            )}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default Inbox;