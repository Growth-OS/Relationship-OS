import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DashboardChat } from "@/components/dashboard/DashboardChat";
import { useDailyBriefing } from "@/components/dashboard/useDailyBriefing";
import { Message } from "@/components/dashboard/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, ListTodo, FileText, TrendingUp, Users, DollarSign, Target } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

  // Sample data for the chart - replace with real data from your API
  const activityData = [
    { date: 'Mon', tasks: 4, meetings: 2, deals: 1 },
    { date: 'Tue', tasks: 6, meetings: 3, deals: 2 },
    { date: 'Wed', tasks: 8, meetings: 4, deals: 3 },
    { date: 'Thu', tasks: 5, meetings: 2, deals: 2 },
    { date: 'Fri', tasks: 7, meetings: 5, deals: 4 },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Welcome back, {firstName}!
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-400">
          Here's what's happening in your workspace today
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/30 dark:from-gray-800 dark:to-gray-900 border-purple-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Deals</p>
              <p className="text-2xl font-semibold text-purple-900 dark:text-purple-100">12</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/30 dark:from-gray-800 dark:to-gray-900 border-blue-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
              <p className="text-2xl font-semibold text-blue-900 dark:text-blue-100">8</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100/30 dark:from-gray-800 dark:to-gray-900 border-green-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</p>
              <p className="text-2xl font-semibold text-green-900 dark:text-green-100">24</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/30 dark:from-gray-800 dark:to-gray-900 border-amber-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
              <DollarSign className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Revenue</p>
              <p className="text-2xl font-semibold text-amber-900 dark:text-amber-100">$24.5k</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#9b87f5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMeetings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#33C3F0" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#33C3F0" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDeals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6E59A5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6E59A5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis dataKey="date" className="text-gray-600 dark:text-gray-400" />
              <YAxis className="text-gray-600 dark:text-gray-400" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem'
                }}
              />
              <Area
                type="monotone"
                dataKey="tasks"
                stroke="#9b87f5"
                fillOpacity={1}
                fill="url(#colorTasks)"
              />
              <Area
                type="monotone"
                dataKey="meetings"
                stroke="#33C3F0"
                fillOpacity={1}
                fill="url(#colorMeetings)"
              />
              <Area
                type="monotone"
                dataKey="deals"
                stroke="#6E59A5"
                fillOpacity={1}
                fill="url(#colorDeals)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border-none">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Calendar, label: "Schedule Meeting", action: () => {} },
                { icon: ListTodo, label: "Create Task", action: () => {} },
                { icon: Clock, label: "Time Tracking", action: () => {} },
                { icon: FileText, label: "New Document", action: () => {} },
              ].map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex items-center justify-start gap-3 h-16 px-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  onClick={action.action}
                >
                  <action.icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              ))}
            </div>
          </Card>

          {/* Activity Overview */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Activity Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium">Upcoming Meetings</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">2 meetings today</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <ListTodo className="h-5 w-5 text-blue-600 dark:text-blue-400" />
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
