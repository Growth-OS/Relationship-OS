import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Chat {
  id: string;
  title?: string;
  last_message?: {
    text: string;
  };
}

export const LinkedInInbox = () => {
  const { data: chatsResponse, isLoading } = useQuery({
    queryKey: ['linkedin-chats'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('linkedin-messages');
      if (error) throw error;
      console.log('Chats response:', data); // Debug log
      return data;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: selectedChat, isLoadingChat } = useQuery({
    queryKey: ['linkedin-messages', chatsResponse?.chats?.[0]?.id],
    queryFn: async () => {
      if (!chatsResponse?.chats?.[0]?.id) return null;
      const { data, error } = await supabase.functions.invoke('linkedin-messages', {
        body: { chatId: chatsResponse.chats[0].id }
      });
      if (error) throw error;
      console.log('Selected chat response:', data); // Debug log
      return data;
    },
    enabled: !!chatsResponse?.chats?.[0]?.id,
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

  // Ensure we have an array of chats
  const chats = Array.isArray(chatsResponse?.chats) ? chatsResponse.chats : [];

  return (
    <Card className="flex h-full">
      <div className="w-1/3 border-r">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {chats.map((chat: Chat) => (
            <div
              key={chat.id}
              className="p-4 hover:bg-gray-50 cursor-pointer border-b"
            >
              <p className="font-medium">{chat.title || 'Direct Message'}</p>
              <p className="text-sm text-gray-500 truncate">
                {chat.last_message?.text || 'No messages'}
              </p>
            </div>
          ))}
        </ScrollArea>
      </div>

      <div className="flex-1">
        <ScrollArea className="h-[calc(100vh-12rem)] p-4">
          {isLoadingChat ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {selectedChat?.map((message: any) => (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.is_outbound
                      ? 'ml-auto bg-purple-600 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </Card>
  );
};