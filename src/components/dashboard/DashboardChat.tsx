import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, FileUp, X } from "lucide-react";
import { useRef, useEffect } from "react";
import { Message } from "./types";

interface DashboardChatProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  currentFile: { content: string; name: string } | null;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onFileUpload: (file: File) => void;
}

export const DashboardChat = ({ 
  messages, 
  input, 
  isLoading, 
  currentFile,
  onInputChange, 
  onSend,
  onFileUpload,
}: DashboardChatProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
    // Reset the input
    if (event.target) {
      event.target.value = '';
    }
  };

  const formatMessage = (content: string) => {
    const formattedContent = content
      .replace(/### (.*?)(?=\n|$)/g, '<h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">$1</h3>')
      .replace(/#### (.*?)(?=\n|$)/g, '<h4 class="text-lg font-medium text-gray-800 dark:text-gray-200 mt-6 mb-3">$1</h4>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-medium text-gray-900 dark:text-gray-100">$1</strong>')
      .replace(/- (.*?)(?=\n|$)/g, '<li class="flex items-start mb-3"><span class="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 mt-2 mr-3 flex-shrink-0"></span><span class="text-gray-700 dark:text-gray-300">$1</span></li>')
      .replace(/<li.*?<\/li>\n/g, match => `<ul class="my-4 space-y-2 ml-2">${match}</ul>`)
      .split('\n\n').join('</p><p class="mb-4 text-gray-700 dark:text-gray-300">');

    return (
      <div 
        className="prose prose-gray dark:prose-invert max-w-none text-left space-y-4 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: `<p class="mb-4 text-gray-700 dark:text-gray-300">${formattedContent}</p>` }} 
      />
    );
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-16rem)] bg-background border">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Bot className="w-5 h-5 text-muted-foreground" />
          AI Assistant
          <span className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></span>
        </h2>
      </div>
      
      <div 
        className="flex-1 overflow-auto p-6 space-y-6" 
        ref={scrollAreaRef}
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
            <Bot className="w-12 h-12 animate-bounce" />
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
              className={`max-w-[85%] rounded-lg px-6 py-4 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground border'
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
      
      <div className="border-t">
        <div className="p-4 space-y-4">
          {currentFile && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
              <FileUp className="h-4 w-4" />
              <span className="flex-1 truncate">{currentFile.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 text-muted-foreground hover:text-foreground"
                onClick={() => onFileUpload(new File([], ""))}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          <div className="flex gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.md,.csv,.json"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <FileUp className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Ask about your tasks, analyze files, or get help..."
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
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};