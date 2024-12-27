import { ScrollArea } from "@/components/ui/scroll-area";
import { EmailItem } from "./EmailItem";
import { useGmailMessages } from "@/hooks/useGmailMessages";

interface EmailListProps {
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string | null) => void;
  filter: 'inbox' | 'starred' | 'snoozed' | 'archived' | 'trash';
}

export const EmailList = ({ selectedMessageId, setSelectedMessageId, filter }: EmailListProps) => {
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

  console.log('Current filter:', filter);
  console.log('All emails:', emails);

  const filteredEmails = emails.filter(email => {
    switch (filter) {
      case 'inbox':
        // Show in inbox only if not starred, not snoozed, not archived, and not trashed
        return !email.is_starred && 
               !email.is_archived && 
               !email.is_trashed && 
               !email.snoozed_until;
      case 'starred':
        return email.is_starred && !email.is_trashed;
      case 'snoozed':
        return email.snoozed_until && 
               new Date(email.snoozed_until) > new Date() && 
               !email.is_trashed;
      case 'archived':
        return email.is_archived && !email.is_trashed;
      case 'trash':
        console.log('Checking trash for email:', email);
        return email.is_trashed === true;
      default:
        return true;
    }
  });

  console.log('Filtered emails:', filteredEmails);

  if (!filteredEmails.length) {
    return <div className="p-4 text-gray-500">No emails found in this category</div>;
  }

  return (
    <ScrollArea className="flex-1">
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