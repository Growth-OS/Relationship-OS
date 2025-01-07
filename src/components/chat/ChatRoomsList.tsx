import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ChatRoomsListProps {
  onRoomSelect: (roomId: string) => void;
  onJoinNewRoom: () => void;
}

export const ChatRoomsList = ({ onRoomSelect, onJoinNewRoom }: ChatRoomsListProps) => {
  const [rooms, setRooms] = useState<any[]>([]);
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

  return (
    <div className="space-y-2 px-2">
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-muted-foreground hover:text-foreground"
        onClick={onJoinNewRoom}
      >
        <Plus className="h-4 w-4 mr-2" />
        Join Room
      </Button>
      
      {rooms.map((room) => (
        <Button
          key={room.id}
          variant="ghost"
          size="sm"
          className="w-full justify-start font-normal"
          onClick={() => onRoomSelect(room.id)}
        >
          # {room.title}
        </Button>
      ))}
      
      {rooms.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No active chat rooms
        </p>
      )}
    </div>
  );
};