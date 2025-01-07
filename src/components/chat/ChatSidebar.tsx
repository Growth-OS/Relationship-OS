import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatRoomsList } from "./ChatRoomsList";
import { JoinRoom } from "./JoinRoom";
import { ChatRoom } from "./ChatRoom";

export const ChatSidebar = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showJoinRoom, setShowJoinRoom] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Chat</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowJoinRoom(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {showJoinRoom ? (
          <div className="p-4">
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