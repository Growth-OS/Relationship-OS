import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface JoinRoomProps {
  onJoinSuccess: (roomId: string) => void;
  onJoin: () => void;
}

export const JoinRoom = ({ onJoinSuccess, onJoin }: JoinRoomProps) => {
  const [accessCode, setAccessCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleJoin = async () => {
    if (!accessCode.trim() || !displayName.trim() || !email.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    // Find the room
    const { data: room, error: roomError } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('access_code', accessCode.toUpperCase())
      .eq('is_active', true)
      .single();

    if (roomError || !room) {
      toast({
        title: 'Invalid access code',
        description: 'Please check the code and try again',
        variant: 'destructive',
      });
      return;
    }

    // Add participant
    const { error: participantError } = await supabase
      .from('chat_participants')
      .insert({
        room_id: room.id,
        display_name: displayName,
        email: email,
        is_external: true,
      });

    if (participantError) {
      toast({
        title: 'Error joining room',
        description: participantError.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Joined successfully',
      description: `You've joined ${room.title}`,
    });

    onJoinSuccess(room.id);
    onJoin();
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Join Chat Room</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Access Code</label>
          <Input
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Enter access code"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Display Name</label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
          />
        </div>
        <Button onClick={handleJoin} className="w-full">
          Join Room
        </Button>
      </div>
    </Card>
  );
};