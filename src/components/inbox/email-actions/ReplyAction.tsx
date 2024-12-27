import { Button } from "@/components/ui/button";
import { Reply } from "lucide-react";
import { useState } from "react";
import { useEmailMutation } from "@/hooks/useEmailMutation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ReplyActionProps {
  messageId: string;
  originalSubject: string;
  originalFrom: string;
}

export const ReplyAction = ({ messageId, originalSubject, originalFrom }: ReplyActionProps) => {
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
      toast.error('Failed to send reply');
    }
  };

  return (
    <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        >
          <Reply className="h-4 w-4 mr-2" />
          Reply
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Reply to Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Replying to: {originalFrom}</p>
            <p className="text-sm text-gray-600 mb-4">Subject: {originalSubject}</p>
            <Textarea
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[200px] bg-white border-gray-200 text-gray-900"
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSendReply}
              disabled={sendEmailMutation.isPending || !replyContent.trim()}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              Send Reply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};