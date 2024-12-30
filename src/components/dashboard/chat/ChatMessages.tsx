import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "../types";

interface ChatMessagesProps {
  projectId: string | null;
}

export const ChatMessages = ({ projectId }: ChatMessagesProps) => {
  const { data: messages } = useQuery({
    queryKey: ['chat-messages', projectId],
    queryFn: async () => {
      const query = supabase
        .from('project_chat_history')
        .select('*')
        .order('created_at', { ascending: true });

      if (projectId) {
        query.eq('project_id', projectId);
      } else {
        query.is('project_id', null);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.map(msg => ({
        ...msg,
        content: msg.message, // Map the message field to content
        role: msg.role as 'user' | 'assistant'
      })) as Message[];
    },
    enabled: true, // Always fetch messages, even for general chat
  });

  if (!messages?.length) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        {projectId ? "No messages in this project chat yet" : "No messages in general chat yet"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-2 ${
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
};