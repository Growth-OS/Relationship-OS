import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { EmailActions } from "./EmailActions";
import type { EmailMessage } from "@/hooks/useGmailMessages";
import { useArchiveEmail } from "@/hooks/useArchiveEmail";
import { cn } from "@/lib/utils";

interface EmailItemProps {
  message: EmailMessage;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const EmailItem = ({ message, isSelected, onSelect }: EmailItemProps) => {
  const archiveMutation = useArchiveEmail();

  return (
    <div 
      className={cn(
        "border-b border-gray-100 transition-colors cursor-pointer",
        isSelected ? 'bg-[#1A1F2C] text-white' : 'hover:bg-gray-50',
      )}
      onClick={() => onSelect(message.id)}
    >
      <div className="px-6 py-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#9b87f5] flex items-center justify-center text-white uppercase">
                {message.from.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={cn(
                    "font-medium truncate",
                    isSelected ? 'text-white' : 'text-gray-900'
                  )}>
                    {message.from}
                  </p>
                  <span className={cn(
                    "text-xs",
                    isSelected ? 'text-gray-300' : 'text-gray-400'
                  )}>
                    {new Date(message.date).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <p className={cn(
              "font-medium mb-1",
              isSelected ? 'text-white' : 'text-gray-700'
            )}>
              {message.subject}
            </p>
            {!isSelected && (
              <p className={cn(
                "text-sm line-clamp-1",
                isSelected ? 'text-gray-300' : 'text-gray-500'
              )}>
                {message.snippet}
              </p>
            )}
            {isSelected && (
              <div className="mt-6 space-y-6">
                <div 
                  className="text-sm prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: message.body || message.snippet }}
                />
                <EmailActions 
                  messageId={message.id}
                  originalSubject={message.subject}
                  originalFrom={message.from}
                  isStarred={message.is_starred}
                />
              </div>
            )}
          </div>
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                archiveMutation.mutate(message.id);
              }}
            >
              <Archive className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};