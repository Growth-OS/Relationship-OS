import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Avatar } from "@/components/ui/avatar";
import { MessageSquare, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Chat {
  id: string;
  name?: string;
  timestamp: string;
  unread_count: number;
  subject?: string;
  mailbox_name?: string;
  attendee_provider_id: string;
  snippet?: string;
}

interface Message {
  id: string;
  text: string;
  is_outbound: boolean;
  timestamp: string;
  sender_name?: string;
}

export const LinkedInInbox = () => {
  const { data: chatsResponse, isLoading } = useQuery({
    queryKey: ['linkedin-chats'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('linkedin-messages');
      if (error) throw error;
      console.log('Chats response:', data);
      return data;
    },
    refetchInterval: 60000,
  });

  const { data: selectedChat, isLoading: isLoadingSelectedChat } = useQuery({
    queryKey: ['linkedin-messages', chatsResponse?.items?.[0]?.id],
    queryFn: async () => {
      if (!chatsResponse?.items?.[0]?.id) return [];
      const { data, error } = await supabase.functions.invoke('linkedin-messages', {
        body: { chatId: chatsResponse.items[0].id }
      });
      if (error) throw error;
      console.log('Selected chat response:', data);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!chatsResponse?.items?.[0]?.id,
  });

  if (isLoading) {
    return (
      <Card className="p-4 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </Card>
    );
  }

  const chats = chatsResponse?.items || [];

  return (
    <div className="flex flex-col h-full space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-primary mb-1">LinkedIn Messages</h1>
        <p className="text-sm text-muted-foreground">Manage your messages</p>
      </div>

      <Card className="flex h-[calc(100vh-12rem)]">
        {/* Left sidebar with conversations */}
        <div className="w-80 border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages"
                className="pl-9 bg-secondary"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {chats.map((chat: Chat) => (
              <div
                key={chat.id}
                className="p-4 hover:bg-secondary cursor-pointer border-b flex items-start gap-3 transition-colors"
              >
                <Avatar className="h-12 w-12 shrink-0">
                  <div className="bg-primary/10 h-full w-full flex items-center justify-center text-lg font-semibold text-primary">
                    {(chat.mailbox_name || chat.name || 'DM')?.[0]?.toUpperCase()}
                  </div>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p className="font-semibold truncate">
                      {chat.mailbox_name || chat.name || 'LinkedIn Member'}
                    </p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(chat.timestamp), 'MMM d')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {chat.subject || 'Direct Message'}
                  </p>
                  {chat.snippet && (
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {chat.snippet}
                    </p>
                  )}
                  {chat.unread_count > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 mt-2 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                      {chat.unread_count} new
                    </span>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Right side with messages */}
        <div className="flex-1 flex flex-col bg-background">
          {/* Chat header */}
          <div className="p-4 border-b flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <div className="bg-primary/10 h-full w-full flex items-center justify-center text-lg font-semibold text-primary">
                {chats[0]?.mailbox_name?.[0]?.toUpperCase() || 'D'}
              </div>
            </Avatar>
            <div>
              <h3 className="font-semibold">
                {chats[0]?.mailbox_name || chats[0]?.name || 'LinkedIn Member'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {chats[0]?.subject || 'Direct Message'}
              </p>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {isLoadingSelectedChat ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-12 w-3/4 ml-auto" />
                <Skeleton className="h-12 w-3/4" />
              </div>
            ) : (
              <div className="space-y-4">
                {(selectedChat || []).map((message: Message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.is_outbound ? 'justify-end' : 'justify-start'}`}
                  >
                    {!message.is_outbound && (
                      <Avatar className="h-8 w-8 mr-2 mt-2">
                        <div className="bg-primary/10 h-full w-full flex items-center justify-center text-sm font-semibold text-primary">
                          {message.sender_name?.[0]?.toUpperCase() || 'D'}
                        </div>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        message.is_outbound
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary'
                      }`}
                    >
                      {!message.is_outbound && message.sender_name && (
                        <p className="text-sm font-medium mb-1">{message.sender_name}</p>
                      )}
                      <p className="text-sm">{message.text}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {format(new Date(message.timestamp), 'h:mm a')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Message input */}
          <div className="p-4 border-t bg-background">
            <div className="bg-secondary rounded-lg p-3 flex items-start gap-2">
              <MessageSquare className="h-5 w-5 text-muted-foreground mt-2" />
              <textarea
                placeholder="Write a message..."
                className="flex-1 bg-transparent border-0 resize-none focus:outline-none min-h-[80px] text-sm"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};