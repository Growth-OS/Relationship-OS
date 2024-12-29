import { format, isValid } from "date-fns";
import { Avatar } from "@/components/ui/avatar";

interface ConversationItemProps {
  id: string;
  name?: string;
  timestamp: string;
  unread_count: number;
  subject?: string;
  mailbox_name?: string;
  snippet?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export const ConversationItem = ({
  name,
  timestamp,
  unread_count,
  subject,
  mailbox_name,
  snippet,
  isSelected,
  onClick
}: ConversationItemProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM d") : "Unknown date";
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 hover:bg-secondary cursor-pointer border-b flex items-start gap-3 transition-colors ${
        isSelected ? "bg-secondary" : ""
      }`}
    >
      <Avatar className="h-12 w-12 shrink-0">
        <div className="bg-primary/10 h-full w-full flex items-center justify-center text-lg font-semibold text-primary">
          {(mailbox_name || name || "DM")?.[0]?.toUpperCase()}
        </div>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <p className="font-semibold truncate">
            {mailbox_name || name || "LinkedIn Member"}
          </p>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDate(timestamp)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate mt-1">
          {subject || "Direct Message"}
        </p>
        {snippet && (
          <p className="text-sm text-muted-foreground truncate mt-1">
            {snippet}
          </p>
        )}
        {unread_count > 0 && (
          <span className="inline-flex items-center px-2.5 py-0.5 mt-2 rounded-full text-xs font-medium bg-primary text-primary-foreground">
            {unread_count} new
          </span>
        )}
      </div>
    </div>
  );
};