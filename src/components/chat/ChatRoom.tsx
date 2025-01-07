import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  created_at: string;
  participant_id: string;
  attachment_url?: string;
}

interface Participant {
  id: string;
  display_name: string;
  is_external: boolean;
}

interface ChatRoomProps {
  roomId: string;
  onBack: () => void;
}

export const ChatRoom = ({ roomId, onBack }: ChatRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInitialData = async () => {
      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (messagesError) {
        toast({
          title: 'Error fetching messages',
          description: messagesError.message,
          variant: 'destructive',
        });
        return;
      }

      setMessages(messagesData || []);

      // Fetch participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('chat_participants')
        .select('*')
        .eq('room_id', roomId);

      if (participantsError) {
        toast({
          title: 'Error fetching participants',
          description: participantsError.message,
          variant: 'destructive',
        });
        return;
      }

      setParticipants(participantsData || []);

      // Get current user's participant ID
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const currentParticipant = participantsData?.find(p => p.user_id === user.id);
        if (currentParticipant) {
          setParticipantId(currentParticipant.id);
        }
      }
    };

    fetchInitialData();

    // Subscribe to new messages
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, toast]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !participantId) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        room_id: roomId,
        participant_id: participantId,
        content: newMessage,
      });

    if (error) {
      toast({
        title: 'Error sending message',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    setNewMessage('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !participantId) return;

    const fileExt = file.name.split('.').pop();
    const filePath = `${roomId}/${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('chat_files')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: 'Error uploading file',
        description: uploadError.message,
        variant: 'destructive',
      });
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('chat_files')
      .getPublicUrl(filePath);

    const { error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        room_id: roomId,
        participant_id: participantId,
        content: `Shared file: ${file.name}`,
        attachment_url: publicUrl,
      });

    if (messageError) {
      toast({
        title: 'Error sending message',
        description: messageError.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="flex flex-col h-[600px] p-4">
      <ScrollArea className="flex-1 mb-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const participant = participants.find(p => p.id === message.participant_id);
            return (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.participant_id === participantId ? 'items-end' : 'items-start'
                }`}
              >
                <span className="text-sm text-muted-foreground">
                  {participant?.display_name}
                </span>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.participant_id === participantId
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}>
                  <p>{message.content}</p>
                  {message.attachment_url && (
                    <a
                      href={message.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Download attachment
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Input
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button onClick={handleSendMessage}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
