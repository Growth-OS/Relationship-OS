import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('completed', false)
        .order('due_date', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: emails } = useQuery({
    queryKey: ["emails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('is_read', false)
        .eq('is_archived', false)
        .eq('is_trashed', false)
        .is('snoozed_until', null);
      if (error) throw error;
      return data;
    },
  });

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 
                   user?.email?.split('@')[0] || 
                   'there';

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Show morning greeting when component mounts
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: `Hi ${firstName}, would you like to know what you need to work on today?`
      }]);
    }
  }, [firstName]);

  const generateBriefing = async () => {
    const unreadEmailsCount = emails?.length || 0;
    const pendingTasksCount = tasks?.length || 0;

    let briefing = `Here's your daily briefing:\n\n`;

    if (unreadEmailsCount > 0) {
      briefing += `📧 You have ${unreadEmailsCount} unread email${unreadEmailsCount === 1 ? '' : 's'}\n\n`;
    }

    if (pendingTasksCount > 0) {
      briefing += `📝 You have ${pendingTasksCount} pending task${pendingTasksCount === 1 ? '' : 's'}:\n`;
      tasks?.slice(0, 5).forEach(task => {
        briefing += `• ${task.title}${task.due_date ? ` (due: ${new Date(task.due_date).toLocaleDateString()})` : ''}\n`;
      });
      if (pendingTasksCount > 5) {
        briefing += `... and ${pendingTasksCount - 5} more tasks\n`;
      }
    }

    if (unreadEmailsCount === 0 && pendingTasksCount === 0) {
      briefing += "🎉 You're all caught up! No pending tasks or unread emails.";
    }

    return briefing;
  };

  const handleSend = async () => {
    if (!input.trim() && messages.length === 1) {
      // Handle the response to the morning greeting
      if (input.toLowerCase().includes('yes') || input.toLowerCase() === 'y') {
        setIsLoading(true);
        const briefing = await generateBriefing();
        setMessages(prev => [...prev, 
          { role: 'user', content: 'Yes, please.' },
          { role: 'assistant', content: briefing }
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
      <Card className="w-full max-w-2xl bg-white border border-gray-100 shadow-sm">
        {messages.length > 0 ? (
          <>
            <div className="h-[400px] overflow-auto" ref={scrollAreaRef}>
              <div className="space-y-3 p-4">
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
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-100">
              <div className="flex gap-2 p-4">
                <Input
                  placeholder="Message GrowthOS..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  disabled={isLoading}
                  className="flex-1 font-sans border-gray-200"
                />
                <Button 
                  onClick={handleSend} 
                  disabled={isLoading}
                  size="icon"
                  className="bg-black text-white hover:bg-black/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 space-y-4">
            <h2 className="text-2xl font-medium text-gray-900">Loading...</h2>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;