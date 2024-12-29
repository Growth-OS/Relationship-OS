import { format, isValid, parseISO } from "date-fns";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  id: string;
  name?: string;
  timestamp: string;
  unread_count: number;
  subject?: string;
  mailbox_name?: string;
  snippet?: string;
  sender_avatar_url?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export const ConversationItem = ({
  name,
  timestamp,
  unread_count,
  snippet,
  sender_avatar_url,
  isSelected,
  onClick
}: ConversationItemProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return "Unknown date";
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      if (messageDate.getTime() === today.getTime()) {
        return format(date, "h:mm a");
      } else {
        return format(date, "MMM d");
      }
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return "Unknown date";
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 hover:bg-secondary cursor-pointer border-b flex items-start gap-3 transition-colors",
        isSelected ? "bg-secondary" : ""
      )}
    >
      <Avatar className="h-12 w-12 shrink-0">
        {sender_avatar_url ? (
          <img src={sender_avatar_url} alt={name} className="h-full w-full object-cover rounded-full" />
        ) : (
          <div className="bg-primary/10 h-full w-full flex items-center justify-center text-lg font-semibold text-primary">
            {(name || "DM")?.[0]?.toUpperCase()}
          </div>
        )}
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <p className="font-semibold truncate">
            {name || "LinkedIn Member"}
          </p>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDate(timestamp)}
          </span>
        </div>
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