import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

interface ChatRoom {
  id: string;
  title: string;
  access_code: string;
}

interface ChatRoomsListProps {
  onRoomSelect: (roomId: string) => void;
  onJoinNewRoom: () => void;
}

export const ChatRoomsList = ({ onRoomSelect, onJoinNewRoom }: ChatRoomsListProps) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('is_active', true);

      if (error) {
        toast({
          title: 'Error fetching rooms',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      setRooms(data || []);
    };

    fetchRooms();

    const channel = supabase
      .channel('chat_rooms')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_rooms',
        },
        () => {
          fetchRooms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const handleCreateRoom = async () => {
    if (!newRoomTitle.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const { data: room, error: roomError } = await supabase
      .from('chat_rooms')
      .insert({
        title: newRoomTitle,
        created_by: user.id,
        access_code: accessCode,
      })
      .select()
      .single();

    if (roomError) {
      toast({
        title: 'Error creating room',
        description: roomError.message,
        variant: 'destructive',
      });
      return;
    }

    const { error: participantError } = await supabase
      .from('chat_participants')
      .insert({
        room_id: room.id,
        user_id: user.id,
        display_name: user.user_metadata.full_name || user.email,
      });

    if (participantError) {
      toast({
        title: 'Error joining room',
        description: participantError.message,
        variant: 'destructive',
      });
      return;
    }

    setNewRoomTitle('');
    setIsCreateDialogOpen(false);
    toast({
      title: 'Room created',
      description: `Access code: ${accessCode}`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Chat Rooms</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Chat Room</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Room Title"
                value={newRoomTitle}
                onChange={(e) => setNewRoomTitle(e.target.value)}
              />
              <Button onClick={handleCreateRoom} className="w-full">
                Create Room
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-2">
        {rooms.map((room) => (
          <Button
            key={room.id}
            variant="outline"
            className="w-full justify-start"
            onClick={() => onRoomSelect(room.id)}
          >
            {room.title}
          </Button>
        ))}
      </div>
    </div>
  );
};
