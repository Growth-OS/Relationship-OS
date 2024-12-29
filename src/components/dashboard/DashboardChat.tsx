import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sun, Bot } from "lucide-react";
import { useRef, useEffect } from "react";
import { Message } from "./types";

interface DashboardChatProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onMorningBriefing?: () => void;
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
    <Card className="flex flex-col h-[calc(100vh-13rem)] bg-white dark:bg-gray-800 border-purple-100 dark:border-gray-700 shadow-lg">
      <div className="p-4 border-b border-purple-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-purple-900 dark:text-purple-100">
          <Bot className="w-5 h-5 text-purple-500" />
          AI Assistant
          <span className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></span>
        </h2>
      </div>
      
      <div 
        className="flex-1 overflow-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-200 dark:scrollbar-thumb-gray-600" 
        ref={scrollAreaRef}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 space-y-4">
            <Bot className="w-12 h-12 text-purple-400 animate-bounce" />
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
            } animate-fade-in`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 shadow-sm ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white dark:bg-purple-700 ml-12'
                  : 'bg-white text-gray-900 dark:bg-gray-700 dark:text-white mr-12'
              } transition-all duration-200 hover:shadow-md`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-purple-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Ask about your tasks, or get help..."
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
              disabled={isLoading}
              className="flex-1 bg-white dark:bg-gray-700 border-purple-100 dark:border-gray-600 focus:ring-purple-500"
            />
            <Button 
              onClick={onSend} 
              disabled={isLoading}
              size="icon"
              className="bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {onMorningBriefing && (
            <Button
              onClick={onMorningBriefing}
              disabled={isLoading}
              variant="outline"
              className="w-full border-purple-100 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-gray-700 text-purple-600 dark:text-purple-400 transition-colors"
            >
              <Sun className="h-4 w-4 mr-2" />
              Morning Briefing
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};