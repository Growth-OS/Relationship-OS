import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import { CreateChatDialog } from "./CreateChatDialog";

export const ChatRoomsList = () => {
  const { data: rooms, isLoading } = useQuery({
    queryKey: ["chatRooms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chat_rooms")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading chat rooms...</div>;
  }

  return (
    <div className="space-y-2">
      <Button variant="default" className="w-full mb-4" asChild>
        <CreateChatDialog>
          <span className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            New Chat Room
          </span>
        </CreateChatDialog>
      </Button>
      
      {rooms?.map((room) => (
        <Button
          key={room.id}
          variant="ghost"
          className="w-full justify-start"
          asChild
        >
          <a href={`/dashboard/chat/${room.id}`}>
            <MessageSquare className="mr-2 h-4 w-4" />
            {room.title}
          </a>
        </Button>
      ))}
    </div>
  );
};