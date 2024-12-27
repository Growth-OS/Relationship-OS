import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { EmailActions } from "./EmailActions";

interface EmailMessage {
  id: string;
  snippet: string;
  payload: {
    headers: {
      name: string;
      value: string;
    }[];
  };
  labelIds: string[];
}

interface EmailItemProps {
  message: EmailMessage;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const EmailItem = ({ message, isSelected, onSelect }: EmailItemProps) => {
  const getHeader = (headerName: string) => {
    return message.payload.headers.find(h => h.name.toLowerCase() === headerName.toLowerCase())?.value;
  };

  return (
    <div 
      className={`p-4 hover:bg-gray-50 cursor-pointer relative group transition-colors ${
        isSelected ? 'bg-gray-50' : ''
      }`}
      onClick={() => onSelect(message.id)}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-gray-900">
              {getHeader('From')}
            </p>
            <span className="text-xs text-gray-400">
              {new Date(getHeader('Date')).toLocaleString()}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">
            {getHeader('Subject')}
          </p>
          <p className="text-sm text-gray-500 line-clamp-1">
            {message.snippet}
          </p>
          {isSelected && (
            <div className="mt-4 space-y-4">
              <div className="text-sm text-gray-600 whitespace-pre-wrap">
                {message.snippet}
              </div>
              <EmailActions 
                messageId={message.id}
                onReply={() => console.log('Reply clicked')}
                onStar={() => console.log('Star clicked')}
              />
            </div>
          )}
        </div>
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              const archiveButton = document.querySelector<HTMLButtonElement>(`button[data-message-id="${message.id}"]`);
              archiveButton?.click();
            }}
          >
            <Archive className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
};