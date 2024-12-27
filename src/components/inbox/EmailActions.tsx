import { Button } from "@/components/ui/button";
import { Archive, Star, Reply } from "lucide-react";
import { useArchiveEmail } from "@/hooks/useArchiveEmail";

interface EmailActionsProps {
  messageId: string;
  onReply?: () => void;
  onStar?: () => void;
}

export const EmailActions = ({ messageId, onReply, onStar }: EmailActionsProps) => {
  const archiveMutation = useArchiveEmail();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        className="gap-2"
        onClick={onReply}
      >
        <Reply className="w-4 h-4" />
        Reply
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={onStar}
      >
        <Star className="w-4 h-4" />
        Star
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={(e) => {
          e.stopPropagation();
          archiveMutation.mutate(messageId);
        }}
      >
        <Archive className="w-4 h-4" />
        Archive
      </Button>
    </div>
  );
};