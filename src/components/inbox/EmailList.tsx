import { ScrollArea } from "@/components/ui/scroll-area";
import { EmailItem } from "./EmailItem";
import { useGmailMessages } from "@/hooks/useGmailMessages";

interface EmailListProps {
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string | null) => void;
}

export const EmailList = ({ selectedMessageId, setSelectedMessageId }: EmailListProps) => {
  const { data: emails, isLoading, error } = useGmailMessages();

  if (isLoading) {
    return <div className="p-4 text-gray-500">Loading emails...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading emails</div>;
  }

  if (!emails?.length) {
    return <div className="p-4 text-gray-500">No emails found</div>;
  }

  return (
    <ScrollArea className="flex-1">
      <div className="divide-y divide-gray-100">
        {emails.map((message) => (
          <EmailItem
            key={message.id}
            message={message}
            isSelected={selectedMessageId === message.id}
            onSelect={(id) => setSelectedMessageId(selectedMessageId === id ? null : id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};