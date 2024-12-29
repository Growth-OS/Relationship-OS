import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot } from "lucide-react";
import { useRef, useEffect } from "react";
import { Message } from "./types";

interface DashboardChatProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

export const DashboardChat = ({ 
  messages, 
  input, 
  isLoading, 
  onInputChange, 
  onSend,
}: DashboardChatProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const formatMessage = (content: string) => {
    // Enhanced formatting for better readability
    const formattedContent = content
      // Headers with proper spacing
      .replace(/### (.*?)(?=\n|$)/g, '<h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">$1</h3>')
      .replace(/#### (.*?)(?=\n|$)/g, '<h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 mt-6 mb-3">$1</h4>')
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-medium text-gray-900 dark:text-gray-100">$1</strong>')
      // List items with proper spacing and bullets
      .replace(/- (.*?)(?=\n|$)/g, '<li class="flex items-start mb-3"><span class="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 mt-2 mr-3 flex-shrink-0"></span><span class="text-gray-700 dark:text-gray-300">$1</span></li>')
      .replace(/<li.*?<\/li>\n/g, match => `<ul class="my-4 space-y-2 ml-2">${match}</ul>`)
      // Paragraphs with proper spacing
      .split('\n\n').join('</p><p class="mb-4 text-gray-700 dark:text-gray-300">');

    return (
      <div 
        className="prose prose-gray dark:prose-invert max-w-none text-left space-y-4 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: `<p class="mb-4 text-gray-700 dark:text-gray-300">${formattedContent}</p>` }} 
      />
    );
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-13rem)] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Bot className="w-5 h-5 text-gray-500" />
          AI Assistant
          <span className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></span>
        </h2>
      </div>
      
      <div 
        className="flex-1 overflow-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600" 
        ref={scrollAreaRef}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 space-y-4">
            <Bot className="w-12 h-12 text-gray-400 animate-bounce" />
            <p className="text-center">
              Start a conversation with your AI assistant
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
              className={`max-w-[85%] rounded-lg px-6 py-4 shadow-sm ${
                message.role === 'user'
                  ? 'bg-gray-900 text-white dark:bg-gray-700'
                  : 'bg-gray-50 text-gray-900 dark:bg-gray-800 dark:text-white border border-gray-100 dark:border-gray-700'
              }`}
            >
              {message.role === 'user' ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              ) : (
                <div className="text-sm leading-relaxed">
                  {formatMessage(message.content)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <div className="flex gap-3">
            <Input
              placeholder="Ask about your tasks, or get help..."
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
              disabled={isLoading}
              className="flex-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-gray-500"
            />
            <Button 
              onClick={onSend} 
              disabled={isLoading}
              size="icon"
              className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};