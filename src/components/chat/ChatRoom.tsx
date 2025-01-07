import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const ChatRoom = () => {
  const { roomId } = useParams();
  const [message, setMessage] = useState("");

  // Fetch chat room details
  const { data: room, isLoading: isLoadingRoom } = useQuery({
    queryKey: ["chatRoom", roomId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_rooms")
        .select("*")
        .eq("id", roomId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch chat messages
  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["chatMessages", roomId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select(`
          *,
          participant:chat_participants(display_name)
        `)
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const { data: participant } = await supabase
        .from("chat_participants")
        .select("id")
        .eq("room_id", roomId)
        .single();

      if (!participant) throw new Error("Not a participant of this chat");

      const { error } = await supabase
        .from("chat_messages")
        .insert({
          room_id: roomId,
          participant_id: participant.id,
          content: message,
        });

      if (error) throw error;

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  if (isLoadingRoom || isLoadingMessages) {
    return <div>Loading chat room...</div>;
  }

  if (!room) {
    return <div>Chat room not found</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-background">
      <div className="border-b p-4">
        <h1 className="text-2xl font-semibold">{room.title}</h1>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages?.map((message) => (
            <div
              key={message.id}
              className="flex flex-col space-y-1"
            >
              <span className="text-sm text-muted-foreground">
                {message.participant?.display_name}
              </span>
              <div className="bg-secondary p-3 rounded-lg">
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;