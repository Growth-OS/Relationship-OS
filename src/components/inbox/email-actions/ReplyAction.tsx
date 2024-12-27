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
      <DialogContent className="sm:max-w-[800px] w-[90vw] h-[80vh] max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Reply to Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 h-full flex flex-col">
          <div className="space-y-4 flex-grow">
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Replying to: {originalFrom}</p>
              <p className="text-sm text-gray-600">Subject: {originalSubject}</p>
            </div>
            <Textarea
              placeholder="Write your reply..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="flex-grow min-h-[400px]"
            />
          </div>
          <div className="flex justify-end pt-4 border-t">
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