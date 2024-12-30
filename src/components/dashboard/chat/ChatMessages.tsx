import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "../types";
import { useEffect } from "react";

interface ChatMessagesProps {
  projectId: string | null;
}

export const ChatMessages = ({ projectId }: ChatMessagesProps) => {
  const { data: messages, error, refetch } = useQuery({
    queryKey: ['chat-messages', projectId],
    queryFn: async () => {
      try {
        const query = supabase
          .from('project_chat_history')
          .select('*')
          .order('created_at', { ascending: true });

        if (projectId) {
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

        return data?.map(msg => ({
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

  // Subscribe to new messages
  useEffect(() => {
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'project_chat_history',
          filter: projectId 
            ? projectId.startsWith('deal-')
              ? `deal_id=eq.${projectId.replace('deal-', '')}`
              : `project_id=eq.${projectId}`
            : 'project_id=is.null,deal_id=is.null'
        },
        () => {
          console.log('New message received, refetching...');
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, refetch]);

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