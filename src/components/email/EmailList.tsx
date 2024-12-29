import { EmailMessage } from "@/integrations/supabase/types";
import { formatDistanceToNow } from "date-fns";
import { Mail, Star, StarOff } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface EmailListProps {
  emails: EmailMessage[];
  selectedEmail: EmailMessage | null;
  onSelectEmail: (email: EmailMessage) => void;
}

export const EmailList = ({ emails, selectedEmail, onSelectEmail }: EmailListProps) => {
  const [hoveredEmailId, setHoveredEmailId] = useState<string | null>(null);

  const toggleStarred = async (email: EmailMessage, event: React.MouseEvent) => {
    event.stopPropagation();
    const { error } = await supabase
      .from('emails')
      .update({ is_starred: !email.is_starred })
      .eq('id', email.id);

    if (error) {
      console.error('Error updating email:', error);
    }
  };

  return (
    <div className="border-r border-gray-200 dark:border-gray-700 overflow-auto">
      {emails.map((email) => (
        <div
          key={email.id}
          className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors
            ${!email.is_read ? 'bg-purple-50 dark:bg-purple-900/10' : ''}
            ${selectedEmail?.id === email.id ? 'bg-purple-100 dark:bg-purple-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
          `}
          onClick={() => onSelectEmail(email)}
          onMouseEnter={() => setHoveredEmailId(email.id)}
          onMouseLeave={() => setHoveredEmailId(null)}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0">
                  {!email.is_read && (
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  )}
                </div>
                <p className={`font-medium truncate ${!email.is_read ? 'text-purple-900 dark:text-purple-100' : 'text-gray-900 dark:text-gray-100'}`}>
                  {email.from_name || email.from_email}
                </p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {email.subject || "(no subject)"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {formatDistanceToNow(new Date(email.received_at), { addSuffix: true })}
              </p>
            </div>
            <button
              onClick={(e) => toggleStarred(email, e)}
              className={`flex-shrink-0 transition-opacity ${
                hoveredEmailId === email.id || email.is_starred ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {email.is_starred ? (
                <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
              ) : (
                <StarOff className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};