import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

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
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onJoin}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm font-medium">Join Chat Room</h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accessCode">Access Code</Label>
          <Input
            id="accessCode"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Enter code"
            className="h-8"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            className="h-8"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="h-8"
          />
        </div>
        
        <Button 
          onClick={handleJoin}
          className="w-full"
          size="sm"
        >
          Join Room
        </Button>
      </div>
    </div>
  );
};