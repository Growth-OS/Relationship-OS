import React, { useState } from 'react';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { ChatRoomsList } from '@/components/chat/ChatRoomsList';

const Chat = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <ChatRoomsList 
            onRoomSelect={setSelectedRoomId} 
            onJoinNewRoom={() => {}}
          />
        </div>
        <div className="md:col-span-3">
          {selectedRoomId ? (
            <ChatRoom 
              roomId={selectedRoomId} 
              onBack={() => setSelectedRoomId(null)}
            />
          ) : (
            <div className="text-center text-muted-foreground">
              Select a room to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;