import { useState } from 'react';
import { format } from 'date-fns';
import { Mail, Star, Archive, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from './types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MessageItemProps {
  message: Message;
  onRefresh: () => void;
}

export const MessageItem = ({ message, onRefresh }: MessageItemProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateMessage = async (updates: Partial<Message>) => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('unified_messages')
        .update(updates)
        .eq('id', message.id);

      if (error) throw error;
      onRefresh();
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Failed to update message');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
      !message.is_read ? 'bg-purple-50 dark:bg-purple-900/10' : ''
    }`}>
      <div className="flex items-start gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={message.sender_avatar_url ?? undefined} />
          <AvatarFallback>
            {message.sender_name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold truncate">
                {message.sender_name}
              </span>
              <span className="text-sm text-gray-500">
                {format(new Date(message.received_at), 'MMM d, h:mm a')}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isUpdating}
                onClick={() => updateMessage({ is_starred: !message.is_starred })}
              >
                <Star 
                  className={`h-4 w-4 ${
                    message.is_starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                  }`} 
                />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isUpdating}
                onClick={() => updateMessage({ is_archived: !message.is_archived })}
              >
                <Archive className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </div>

          {message.subject && (
            <div className="font-medium mb-1">{message.subject}</div>
          )}

          <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};