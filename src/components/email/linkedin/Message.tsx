import { format, isValid, parseISO } from "date-fns";
import { Avatar } from "@/components/ui/avatar";

interface MessageProps {
  id: string;
  text: string;
  is_outbound: boolean;
  timestamp: string;
  sender_name?: string;
  sender_avatar_url?: string;
}

export const Message = ({ 
  text, 
  is_outbound, 
  timestamp, 
  sender_name,
  sender_avatar_url 
}: MessageProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "h:mm a") : "Unknown time";
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return "Unknown time";
    }
  };

  return (
    <div className={`flex ${is_outbound ? "justify-end" : "justify-start"} mb-4`}>
      {!is_outbound && (
        <Avatar className="h-8 w-8 mr-2">
          {sender_avatar_url ? (
            <img src={sender_avatar_url} alt={sender_name} className="h-full w-full object-cover rounded-full" />
          ) : (
            <div className="bg-primary/10 h-full w-full flex items-center justify-center text-sm font-semibold text-primary">
              {sender_name?.[0]?.toUpperCase() || "D"}
            </div>
          )}
        </Avatar>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
          is_outbound
            ? "bg-primary text-primary-foreground"
            : "bg-secondary"
        }`}
      >
        {!is_outbound && sender_name && (
          <p className="text-sm font-medium mb-1">{sender_name}</p>
        )}
        <p className="text-sm whitespace-pre-wrap">{text}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {formatDate(timestamp)}
        </span>
      </div>
    </div>
  );
};