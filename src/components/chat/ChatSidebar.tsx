import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatRoomsList } from "./ChatRoomsList";
import { JoinRoom } from "./JoinRoom";
import { ChatRoom } from "./ChatRoom";
import { MessageSquare } from "lucide-react";

export const ChatSidebar = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showJoinRoom, setShowJoinRoom] = useState(false);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center gap-2 px-2">
        <MessageSquare className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-medium">Chat Rooms</h2>
      </div>

      <ScrollArea className="flex-1">
        {showJoinRoom ? (
          <div className="px-2">
            <JoinRoom 
              onJoinSuccess={(roomId) => {
                setSelectedRoomId(roomId);
                setShowJoinRoom(false);
              }}
              onJoin={() => setShowJoinRoom(false)}
            />
          </div>
        ) : selectedRoomId ? (
          <ChatRoom
            roomId={selectedRoomId}
            onBack={() => setSelectedRoomId(null)}
          />
        ) : (
          <ChatRoomsList
            onRoomSelect={(roomId) => setSelectedRoomId(roomId)}
            onJoinNewRoom={() => setShowJoinRoom(true)}
          />
        )}
      </ScrollArea>
    </div>
  );
};