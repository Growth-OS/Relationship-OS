import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DashboardChat } from "@/components/dashboard/DashboardChat";
import { useDailyBriefing } from "@/components/dashboard/useDailyBriefing";
import { Message } from "@/components/dashboard/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, ListTodo, FileText } from "lucide-react";

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

  const quickActions = [
    { icon: Calendar, label: "Schedule Meeting", action: () => {} },
    { icon: ListTodo, label: "Create Task", action: () => {} },
    { icon: Clock, label: "Time Tracking", action: () => {} },
    { icon: FileText, label: "New Document", action: () => {} },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {firstName}!
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400">
          Here's what's happening in your workspace today
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex items-center justify-start gap-3 h-16 px-4"
                  onClick={action.action}
                >
                  <action.icon className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              ))}
            </div>
          </Card>

          {/* Activity Overview */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Activity Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">Upcoming Meetings</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">2 meetings today</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <ListTodo className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Pending Tasks</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">5 tasks due today</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Chat */}
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
