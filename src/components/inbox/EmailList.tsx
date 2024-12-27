import { ScrollArea } from "@/components/ui/scroll-area";
import { EmailItem } from "./EmailItem";
import { useGmailMessages } from "@/hooks/useGmailMessages";

interface EmailListProps {
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string | null) => void;
  filter: 'inbox' | 'starred' | 'snoozed' | 'archived' | 'trash' | 'sent';
}

export const EmailList = ({ selectedMessageId, setSelectedMessageId, filter }: EmailListProps) => {
  const { data: emails, isLoading, error } = useGmailMessages();

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading emails...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error loading emails</div>;
  }

  if (!emails?.length) {
    return <div className="p-6 text-gray-500">No emails found</div>;
  }

  const filteredEmails = emails.filter(email => {
    switch (filter) {
      case 'inbox':
        return !email.is_starred && 
               !email.is_archived && 
               !email.is_trashed && 
               !email.snoozed_until &&
               !email.is_sent;
      case 'sent':
        return email.is_sent && !email.is_trashed;
      case 'starred':
        return email.is_starred && !email.is_trashed;
      case 'snoozed':
        return email.snoozed_until && 
               new Date(email.snoozed_until) > new Date() && 
               !email.is_trashed;
      case 'archived':
        return email.is_archived && !email.is_trashed;
      case 'trash':
        return email.is_trashed;
      default:
        return true;
    }
  });

  if (!filteredEmails.length) {
    return <div className="p-6 text-gray-500">No emails found in this category</div>;
  }

  return (
    <ScrollArea className="flex-1 bg-white">
      <div className="divide-y divide-gray-100">
        {filteredEmails.map((message) => (
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