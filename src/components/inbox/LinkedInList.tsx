import { ScrollArea } from "@/components/ui/scroll-area";
import { LinkedInItem } from "./LinkedInItem";

interface LinkedInListProps {
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string | null) => void;
}

const mockLinkedInMessages = [
  {
    id: '1',
    snippet: "Hi! I came across your profile and I'm impressed with your work in software development...",
    sender: {
      name: 'Sarah Chen',
      title: 'Tech Recruiter at TechCorp',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    },
    timestamp: new Date(2024, 2, 15).toISOString(),
    type: 'connection_request'
  },
  {
    id: '2',
    snippet: "Thanks for connecting! I'd love to discuss potential collaboration opportunities...",
    sender: {
      name: 'Michael Rodriguez',
      title: 'Senior Product Manager',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
    },
    timestamp: new Date(2024, 2, 14).toISOString(),
    type: 'message'
  },
  {
    id: '3',
    snippet: "I noticed we share interests in AI and machine learning. Would love to exchange ideas...",
    sender: {
      name: 'Emily Watson',
      title: 'AI Research Lead',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
    },
    timestamp: new Date(2024, 2, 13).toISOString(),
    type: 'message'
  }
];

export const LinkedInList = ({ selectedMessageId, setSelectedMessageId }: LinkedInListProps) => {
  return (
    <ScrollArea className="flex-1">
      <div className="divide-y divide-gray-100">
        {mockLinkedInMessages.map((message) => (
          <LinkedInItem
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