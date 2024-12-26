import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface LinkedInMessage {
  id: string;
  snippet: string;
  sender: {
    name: string;
    title: string;
    avatar: string;
  };
  timestamp: string;
  type: 'connection_request' | 'message';
}

interface LinkedInItemProps {
  message: LinkedInMessage;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const LinkedInItem = ({ message, isSelected, onSelect }: LinkedInItemProps) => {
  return (
    <div 
      className={`p-4 hover:bg-gray-50 cursor-pointer relative group transition-colors ${
        isSelected ? 'bg-gray-50' : ''
      }`}
      onClick={() => onSelect(message.id)}
    >
      <div className="flex gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={message.sender.avatar} />
          <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-gray-900">
                {message.sender.name}
              </p>
              <p className="text-sm text-gray-500">
                {message.sender.title}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {message.type === 'connection_request' && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Connection Request
                </Badge>
              )}
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {new Date(message.timestamp).toLocaleString()}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  // Archive functionality would go here
                }}
              >
                <Archive className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-1 mt-1">
            {message.snippet}
          </p>
          {isSelected && (
            <div className="mt-4 text-sm text-gray-600">
              {message.snippet}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};