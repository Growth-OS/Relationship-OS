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
      const { data, error } = await supabase
        .from('project_chat_history')
        .select('*')
        .eq('project_id', projectId || '')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!projectId,
  });

  if (!messages?.length) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        {projectId ? "No messages in this project chat yet" : "Select a project to start chatting"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
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