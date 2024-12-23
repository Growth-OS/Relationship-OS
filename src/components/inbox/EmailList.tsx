import { ScrollArea } from "@/components/ui/scroll-area";
import { EmailItem } from "./EmailItem";

interface EmailListProps {
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string | null) => void;
}

const mockEmails = [
  {
    id: '1',
    snippet: "Hi there! I wanted to discuss the upcoming project timeline and deliverables...",
    payload: {
      headers: [
        { name: 'From', value: 'John Smith <john@example.com>' },
        { name: 'Subject', value: 'Project Timeline Discussion' },
        { name: 'Date', value: new Date(2024, 2, 15).toISOString() }
      ]
    },
    labelIds: ['INBOX']
  },
  {
    id: '2',
    snippet: "Thank you for your interest in our services. I've attached our proposal...",
    payload: {
      headers: [
        { name: 'From', value: 'Sarah Johnson <sarah@company.com>' },
        { name: 'Subject', value: 'Service Proposal' },
        { name: 'Date', value: new Date(2024, 2, 14).toISOString() }
      ]
    },
    labelIds: ['INBOX']
  },
  {
    id: '3',
    snippet: "Just following up on our conversation from last week regarding...",
    payload: {
      headers: [
        { name: 'From', value: 'Mike Wilson <mike@business.com>' },
        { name: 'Subject', value: 'Follow-up: Strategy Meeting' },
        { name: 'Date', value: new Date(2024, 2, 13).toISOString() }
      ]
    },
    labelIds: ['INBOX']
  }
];

export const EmailList = ({ selectedMessageId, setSelectedMessageId }: EmailListProps) => {
  return (
    <ScrollArea className="flex-1">
      <div className="divide-y">
        {mockEmails.map((message) => (
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