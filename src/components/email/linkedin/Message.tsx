import { format } from "date-fns";
import { Avatar } from "@/components/ui/avatar";

interface MessageProps {
  id: string;
  text: string;
  is_outbound: boolean;
  timestamp: string;
  sender_name?: string;
}

export const Message = ({ text, is_outbound, timestamp, sender_name }: MessageProps) => {
  return (
    <div className={`flex ${is_outbound ? "justify-end" : "justify-start"}`}>
      {!is_outbound && (
        <Avatar className="h-8 w-8 mr-2 mt-2">
          <div className="bg-primary/10 h-full w-full flex items-center justify-center text-sm font-semibold text-primary">
            {sender_name?.[0]?.toUpperCase() || "D"}
          </div>
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
        <p className="text-sm">{text}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {format(new Date(timestamp), "h:mm a")}
        </span>
      </div>
    </div>
  );
};