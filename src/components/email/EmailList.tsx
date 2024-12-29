import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Email } from "@/types/email";

interface EmailListProps {
  emails: Email[];
  isLoading: boolean;
  selectedEmail: Email | null;
  onSelectEmail: (email: Email) => void;
}

export const EmailList = ({ emails, isLoading, selectedEmail, onSelectEmail }: EmailListProps) => {
  if (isLoading) {
    return (
      <div className="w-96 border-r border-border p-4 space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-96 border-r border-border overflow-auto">
      {emails.map((email) => (
        <button
          key={email.id}
          onClick={() => onSelectEmail(email)}
          className={`w-full p-4 text-left border-b border-border hover:bg-accent transition-colors ${
            selectedEmail?.id === email.id ? "bg-accent" : ""
          }`}
        >
          <div className="flex justify-between items-start mb-1">
            <span className="font-medium">{email.from_email}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(email.received_at), { addSuffix: true })}
            </span>
          </div>
          <div className="font-medium text-sm truncate">{email.subject}</div>
          <div className="text-sm text-muted-foreground truncate">
            {email.snippet}
          </div>
        </button>
      ))}
    </div>
  );
};