import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "../types";

interface ChatMessagesProps {
  projectId: string | null;
}

export const ChatMessages = ({ projectId }: ChatMessagesProps) => {
  const { data: messages, error } = useQuery({
    queryKey: ['chat-messages', projectId],
    queryFn: async () => {
      try {
        const query = supabase
          .from('project_chat_history')
          .select('*')
          .order('created_at', { ascending: true });

        if (projectId) {
          // If the projectId starts with 'deal-', it's a deal chat
          if (projectId.startsWith('deal-')) {
            const dealId = projectId.replace('deal-', '');
            query.eq('deal_id', dealId);
          } else {
            query.eq('project_id', projectId);
          }
        } else {
          query.is('project_id', null).is('deal_id', null);
        }

        const { data, error } = await query;
        
        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }

        if (!data) {
          return [];
        }

        return data.map(msg => ({
          ...msg,
          content: msg.message,
          role: msg.role as 'user' | 'assistant'
        })) as Message[];
      } catch (err) {
        console.error('Error fetching messages:', err);
        throw err;
      }
    },
    enabled: true,
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-destructive">
        Error loading messages. Please try again later.
      </div>
    );
  }

  if (!messages?.length) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No messages yet. Start a conversation!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-4 rounded-lg ${
            message.role === 'assistant'
              ? 'bg-muted'
              : 'bg-primary text-primary-foreground'
          }`}
        >
          {message.content}
        </div>
      ))}
    </div>
  );
};