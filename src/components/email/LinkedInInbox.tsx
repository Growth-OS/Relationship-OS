import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface Chat {
  id: string;
  name?: string;
  timestamp: string;
  unread_count: number;
  subject?: string;
  mailbox_name?: string;
  attendee_provider_id: string;
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
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: selectedChat, isLoading: isLoadingSelectedChat } = useQuery({
    queryKey: ['linkedin-messages', chatsResponse?.items?.[0]?.id],
    queryFn: async () => {
      if (!chatsResponse?.items?.[0]?.id) return null;
      const { data, error } = await supabase.functions.invoke('linkedin-messages', {
        body: { chatId: chatsResponse.items[0].id }
      });
      if (error) throw error;
      console.log('Selected chat response:', data);
      return data;
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

  // Ensure we have an array of chats
  const chats = chatsResponse?.items || [];

  return (
    <Card className="flex h-full">
      <div className="w-1/3 border-r">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {chats.map((chat: Chat) => (
            <div
              key={chat.id}
              className="p-4 hover:bg-gray-50 cursor-pointer border-b"
            >
              <div className="flex justify-between items-start mb-1">
                <p className="font-medium">
                  {chat.mailbox_name || chat.name || 'Direct Message'}
                </p>
                {chat.unread_count > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {chat.unread_count}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {format(new Date(chat.timestamp), 'MMM d, h:mm a')}
              </p>
              {chat.subject && (
                <p className="text-sm text-gray-600 mt-1 truncate">
                  {chat.subject}
                </p>
              )}
            </div>
          ))}
        </ScrollArea>
      </div>

      <div className="flex-1">
        <ScrollArea className="h-[calc(100vh-12rem)] p-4">
          {isLoadingSelectedChat ? (
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