import { format } from "date-fns";
import { Mail, Star, Archive, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Email {
  id: string;
  from_email: string;
  subject: string;
  snippet: string | null;
  received_at: string;
  is_read: boolean;
  is_starred: boolean;
}

interface EmailListItemProps {
  email: Email;
  onEmailClick: (email: Email) => void;
  onRefetch: () => void;
}

export const EmailListItem = ({ email, onEmailClick, onRefetch }: EmailListItemProps) => {
  const handleToggleStar = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase
      .from("emails")
      .update({ is_starred: !email.is_starred })
      .eq("id", email.id);
    onRefetch();
  };

  const handleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase
      .from("emails")
      .update({ is_archived: true })
      .eq("id", email.id);
    onRefetch();
  };

  const handleTrash = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase
      .from("emails")
      .update({ is_trashed: true })
      .eq("id", email.id);
    onRefetch();
  };

  return (
    <div
      onClick={() => onEmailClick(email)}
      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
        !email.is_read ? "bg-blue-50 dark:bg-blue-900/10" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-2">
          <Mail className="h-5 w-5 text-gray-400 mt-1" />
          <div className="flex-1 min-w-0">
            <span className="font-medium block text-left">{email.from_email}</span>
            <h3 className="font-medium text-left mt-1">{email.subject}</h3>
            <p className="text-sm text-gray-500 line-clamp-1 text-left mt-1">{email.snippet}</p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2 ml-4">
          <span className="text-sm text-gray-500">
            {format(new Date(email.received_at), "MMM d, h:mm a")}
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleStar}
            >
              <Star
                className={`h-4 w-4 ${
                  email.is_starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleArchive}
            >
              <Archive className="h-4 w-4 text-gray-400" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleTrash}
            >
              <Trash className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};