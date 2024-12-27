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
        isSelected ? 'bg-gray-50' : 'hover:bg-gray-50',
      )}
      onClick={() => onSelect(message.id)}
    >
      <div className="px-6 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#9b87f5] flex items-center justify-center text-white uppercase">
                {message.from.charAt(0)}
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">
                  {message.from}
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(message.date).toLocaleString()}
                </span>
              </div>
            </div>
            <EmailActions 
              messageId={message.id}
              originalSubject={message.subject}
              originalFrom={message.from}
              isStarred={message.is_starred}
            />
          </div>
          
          <div className="text-left">
            <p className="font-medium mb-1 text-gray-900">
              {message.subject}
            </p>
            {!isSelected && (
              <p className="text-sm line-clamp-1 text-gray-600">
                {message.snippet}
              </p>
            )}
            {isSelected && (
              <div 
                className="mt-6 text-sm prose max-w-none text-gray-800 text-left"
                dangerouslySetInnerHTML={{ __html: message.body || message.snippet }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};