import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardChat } from "@/components/dashboard/DashboardChat";
import { Message } from "@/components/dashboard/types";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: chatHistory } = useQuery({
    queryKey: ["chat-history", selectedProject],
    queryFn: async () => {
      if (!selectedProject) return [];
      const { data, error } = await supabase
        .from("project_chat_history")
        .select("*")
        .eq("project_id", selectedProject)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.message
      }));
    },
    enabled: !!selectedProject
  });

  // Set messages when chat history changes
  useState(() => {
    if (chatHistory) {
      setMessages(chatHistory);
    }
  }, [chatHistory]);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 
                   user?.email?.split('@')[0] || 
                   'there';

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    if (!user) {
      toast.error("You must be logged in to send messages");
      return;
    }

    setIsLoading(true);
    const newMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    
    try {
      // Save user message
      if (selectedProject) {
        await supabase.from("project_chat_history").insert({
          project_id: selectedProject,
          user_id: user.id,
          message: input,
          role: 'user'
        });
      }

      const { data, error } = await supabase.functions.invoke('chat-with-data', {
        body: {
          message: input,
          userId: user.id,
          projectId: selectedProject
        },
      });

      if (error) throw error;
      
      if (data?.response) {
        const assistantMessage: Message = { 
          role: 'assistant', 
          content: data.response 
        };
        setMessages(prev => [...prev, assistantMessage]);

        // Save assistant message
        if (selectedProject) {
          await supabase.from("project_chat_history").insert({
            project_id: selectedProject,
            user_id: user.id,
            message: data.response,
            role: 'assistant'
          });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get a response. Please try again.');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <DashboardHeader firstName={firstName} />
      
      <div className="w-full max-w-xs mb-4">
        <Select
          value={selectedProject || "general"}
          onValueChange={(value) => {
            setSelectedProject(value === "general" ? null : value);
            setMessages([]);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a project chat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Chat</SelectItem>
            {projects?.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DashboardChat 
        messages={messages}
        input={input}
        isLoading={isLoading}
        onInputChange={setInput}
        onSend={handleSendMessage}
      />
    </div>
  );
};

export default Dashboard;