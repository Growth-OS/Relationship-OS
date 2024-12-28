import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useRef } from "react";
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
  onSend 
}: DashboardChatProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  return (
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
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
                disabled={isLoading}
                className="flex-1 font-sans border-gray-200"
              />
              <Button 
                onClick={onSend} 
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
  );
};