import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DashboardChat } from "@/components/dashboard/DashboardChat";
import { useDailyBriefing } from "@/components/dashboard/useDailyBriefing";
import { Message } from "@/components/dashboard/types";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { generateBriefing } = useDailyBriefing();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 
                   user?.email?.split('@')[0] || 
                   'there';

  // Show morning greeting when component mounts
  useState(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `Hi ${firstName}, would you like to know what you need to work on today?`
      }]);
    }
  });

  const formatBriefing = (briefing: ReturnType<typeof generateBriefing>) => {
    let message = `Here's your daily briefing:\n\n`;

    if (briefing.unreadEmails > 0) {
      message += `📧 You have ${briefing.unreadEmails} unread email${briefing.unreadEmails === 1 ? '' : 's'}\n\n`;
    }

    if (briefing.pendingTasks.total > 0) {
      message += `📝 You have ${briefing.pendingTasks.total} pending task${briefing.pendingTasks.total === 1 ? '' : 's'}:\n`;
      briefing.pendingTasks.items.forEach(task => {
        message += `• ${task.title}${task.due_date ? ` (due: ${new Date(task.due_date).toLocaleDateString()})` : ''}\n`;
      });
      if (briefing.pendingTasks.total > 5) {
        message += `... and ${briefing.pendingTasks.total - 5} more tasks\n`;
      }
    }

    if (briefing.unreadEmails === 0 && briefing.pendingTasks.total === 0) {
      message += "🎉 You're all caught up! No pending tasks or unread emails.";
    }

    return message;
  };

  const handleSend = async () => {
    if (!input.trim() && messages.length === 1) {
      // Handle the response to the morning greeting
      if (input.toLowerCase().includes('yes') || input.toLowerCase() === 'y') {
        setIsLoading(true);
        const briefing = generateBriefing();
        setMessages(prev => [...prev, 
          { role: 'user', content: 'Yes, please.' },
          { role: 'assistant', content: formatBriefing(briefing) }
        ]);
        setIsLoading(false);
        return;
      }
    }

    if (!input.trim()) return;

    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const userMessage = { role: 'user' as const, content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      const { data, error } = await supabase.functions.invoke('chat-with-data', {
        body: { message: input, userId: user.id },
      });

      if (error) throw error;

      const aiMessage = { role: 'assistant' as const, content: data.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <DashboardChat
        messages={messages}
        input={input}
        isLoading={isLoading}
        onInputChange={setInput}
        onSend={handleSend}
      />
    </div>
  );
};

export default Dashboard;