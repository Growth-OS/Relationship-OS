import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { ConversationItem } from "./linkedin/ConversationItem";
import { Message } from "./linkedin/Message";
import { useState } from "react";

export const LinkedInInbox = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

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
    queryKey: ['linkedin-messages', selectedChatId],
    queryFn: async () => {
      if (!selectedChatId) return [];
      const { data, error } = await supabase.functions.invoke('linkedin-messages', {
        body: { chatId: selectedChatId }
      });
      if (error) throw error;
      console.log('Selected chat response:', data);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!selectedChatId,
  });

  const chats = chatsResponse?.items || [];
  const selectedChatInfo = chats.find(chat => chat.id === selectedChatId);

  if (isLoading) {
    return (
      <Card className="p-4 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </Card>
    );
  }

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
            {chats.map((chat) => (
              <ConversationItem
                key={chat.id}
                {...chat}
                name={chat.sender_name}
                mailbox_name={chat.sender_name}
                snippet={chat.text}
                timestamp={chat.received_at}
                isSelected={chat.id === selectedChatId}
                onClick={() => setSelectedChatId(chat.id)}
              />
            ))}
          </ScrollArea>
        </div>

        {/* Right side with messages */}
        <div className="flex-1 flex flex-col bg-background">
          {selectedChatInfo ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <div className="bg-primary/10 h-full w-full flex items-center justify-center text-lg font-semibold text-primary">
                    {selectedChatInfo?.sender_name?.[0]?.toUpperCase() || "D"}
                  </div>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {selectedChatInfo?.sender_name || "LinkedIn Member"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedChatInfo?.subject || "Direct Message"}
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
                    {(selectedChat || []).map((message) => (
                      <Message 
                        key={message.id} 
                        {...message}
                        text={message.text}
                        sender_name={message.sender_name}
                        timestamp={message.received_at}
                      />
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation to view messages
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};