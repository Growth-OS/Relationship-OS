import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { ChatRoomsList } from '@/components/chat/ChatRoomsList';
import { JoinRoom } from '@/components/chat/JoinRoom';

const Chat = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showJoinRoom, setShowJoinRoom] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Chat Rooms</h1>
        <Button onClick={() => setShowJoinRoom(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Chat Room
        </Button>
      </div>

      {showJoinRoom ? (
        <div className="max-w-md mx-auto">
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
        <div className="grid gap-4 md:grid-cols-3">
          <ChatRoomsList
            onRoomSelect={(roomId) => setSelectedRoomId(roomId)}
            onJoinNewRoom={() => setShowJoinRoom(true)}
          />
        </div>
      )}
    </div>
  );
};

export default Chat;