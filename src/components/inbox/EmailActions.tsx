import { Button } from "@/components/ui/button";
import { Archive, Star, Reply } from "lucide-react";
import { useArchiveEmail } from "@/hooks/useArchiveEmail";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useEmailMutation } from "@/hooks/useEmailMutation";
import { Textarea } from "@/components/ui/textarea";

interface EmailActionsProps {
  messageId: string;
  originalSubject: string;
  originalFrom: string;
  onStar?: () => void;
}

export const EmailActions = ({ messageId, originalSubject, originalFrom, onStar }: EmailActionsProps) => {
  const archiveMutation = useArchiveEmail();
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const sendEmailMutation = useEmailMutation();

  const handleSendReply = async () => {
    try {
      await sendEmailMutation.mutate({
        to: originalFrom,
        subject: originalSubject,
        content: replyContent,
        replyToMessageId: messageId,
      });
      setIsReplyOpen(false);
      setReplyContent('');
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
          >
            <Reply className="w-4 h-4" />
            Reply
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reply to Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Replying to: {originalFrom}</p>
              <p className="text-sm text-gray-500 mb-4">Subject: {originalSubject}</p>
              <Textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSendReply}
                disabled={sendEmailMutation.isPending || !replyContent.trim()}
              >
                Send Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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