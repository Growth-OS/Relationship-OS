import { useState } from "react";
import { MessageSquare, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatRoomsList } from "./ChatRoomsList";
import { JoinRoom } from "./JoinRoom";
import { ChatRoom } from "./ChatRoom";

export const ChatSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showJoinRoom, setShowJoinRoom] = useState(false);

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-background border-l border-border shadow-lg flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chat</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowJoinRoom(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {showJoinRoom ? (
          <div className="p-4">
            <JoinRoom onJoin={() => setShowJoinRoom(false)} />
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