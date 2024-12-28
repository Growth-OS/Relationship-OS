import { ScrollArea } from "@/components/ui/scroll-area";
import { LinkedInItem } from "./LinkedInItem";
import { useLinkedInMessages } from "@/hooks/useLinkedInMessages";
import { Loader2 } from "lucide-react";

interface LinkedInListProps {
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string | null) => void;
}

export const LinkedInList = ({ selectedMessageId, setSelectedMessageId }: LinkedInListProps) => {
  const { messages, isLoading } = useLinkedInMessages();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="divide-y divide-gray-100">
        {messages?.map((message) => (
          <LinkedInItem
            key={message.id}
            message={{
              id: message.id,
              snippet: message.content,
              sender: {
                name: message.sender_name,
                title: '', // We don't have this in our current schema
                avatar: message.sender_avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.sender_name}`
              },
              timestamp: message.received_at,
              type: 'message' as const
            }}
            isSelected={selectedMessageId === message.id}
            onSelect={(id) => setSelectedMessageId(selectedMessageId === id ? null : id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};