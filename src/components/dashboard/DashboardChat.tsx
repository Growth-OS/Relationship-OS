import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sun } from "lucide-react";
import { useRef, useEffect } from "react";
import { Message } from "./types";

interface DashboardChatProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onMorningBriefing: () => void;
}

export const DashboardChat = ({ 
  messages, 
  input, 
  isLoading, 
  onInputChange, 
  onSend,
  onMorningBriefing
}: DashboardChatProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="flex flex-col h-[calc(100vh-13rem)] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          AI Assistant
        </h2>
      </div>
      
      <div 
        className="flex-1 overflow-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600" 
        ref={scrollAreaRef}
      >
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p className="text-center">
              Start a conversation or get your morning briefing
            </p>
          </div>
        )}
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
                  ? 'bg-black text-white dark:bg-gray-700'
                  : 'bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-white'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Message GrowthOS..."
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={onSend} 
              disabled={isLoading}
              size="icon"
              className="bg-black text-white hover:bg-black/90 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            onClick={onMorningBriefing}
            disabled={isLoading}
            variant="outline"
            className="w-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Sun className="h-4 w-4 mr-2" />
            Morning Briefing
          </Button>
        </div>
      </div>
    </Card>
  );
};