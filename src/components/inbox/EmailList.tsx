import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useGmailMessages } from "@/hooks/useGmailMessages";
import { EmailItem } from "./EmailItem";

interface EmailListProps {
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string | null) => void;
}

export const EmailList = ({ selectedMessageId, setSelectedMessageId }: EmailListProps) => {
  const { data: messages, isLoading: isLoadingMessages, error: messagesError, refetch } = useGmailMessages();

  if (isLoadingMessages) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (messagesError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-red-500 mb-4">
          {messagesError instanceof Error ? messagesError.message : 'Failed to load emails'}
        </p>
        <Button 
          onClick={() => refetch()}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!messages?.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No emails found
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="divide-y">
        {messages.map((message) => (
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