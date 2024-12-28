import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardChat } from "@/components/dashboard/DashboardChat";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardActivityChart } from "@/components/dashboard/DashboardActivityChart";
import { DashboardQuickActions } from "@/components/dashboard/DashboardQuickActions";
import { DashboardActivity } from "@/components/dashboard/DashboardActivity";
import { useDailyBriefing } from "@/components/dashboard/useDailyBriefing";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
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

  const handleMorningBriefing = () => {
    setIsLoading(true);
    const briefing = generateBriefing();
    setMessages(prev => [...prev, 
      { role: 'assistant', content: formatBriefing(briefing) }
    ]);
    setIsLoading(false);
  };

  const handleSend = async () => {
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
    <div className="flex flex-col gap-6 animate-fade-in">
      <DashboardHeader firstName={firstName} />
      <DashboardStats />
      <DashboardActivityChart />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <DashboardQuickActions />
          <DashboardActivity />
        </div>
        
        <div>
          <DashboardChat
            messages={messages}
            input={input}
            isLoading={isLoading}
            onInputChange={setInput}
            onSend={handleSend}
            onMorningBriefing={handleMorningBriefing}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;