import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { EmailActions } from "./EmailActions";
import type { EmailMessage } from "@/hooks/useGmailMessages";

interface EmailItemProps {
  message: EmailMessage;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const EmailItem = ({ message, isSelected, onSelect }: EmailItemProps) => {
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
              {message.from}
            </p>
            <span className="text-xs text-gray-400">
              {new Date(message.date).toLocaleString()}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">
            {message.subject}
          </p>
          {!isSelected && (
            <p className="text-sm text-gray-500 line-clamp-2">
              {message.snippet}
            </p>
          )}
          {isSelected && (
            <div className="mt-4 space-y-4">
              <div 
                className="text-sm text-gray-600 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: message.body || message.snippet }}
              />
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
              console.log('Archive clicked:', message.id);
            }}
          >
            <Archive className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
};