import { Button } from "@/components/ui/button";
import { Archive, Star, Reply, Clock, Trash2 } from "lucide-react";
import { useArchiveEmail } from "@/hooks/useArchiveEmail";
import { useStarEmail, useSnoozeEmail, useTrashEmail } from "@/hooks/useEmailActions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { useEmailMutation } from "@/hooks/useEmailMutation";
import { Textarea } from "@/components/ui/textarea";

interface EmailActionsProps {
  messageId: string;
  originalSubject: string;
  originalFrom: string;
  isStarred?: boolean;
}

export const EmailActions = ({ 
  messageId, 
  originalSubject, 
  originalFrom, 
  isStarred = false 
}: EmailActionsProps) => {
  const archiveMutation = useArchiveEmail();
  const starMutation = useStarEmail();
  const snoozeMutation = useSnoozeEmail();
  const trashMutation = useTrashEmail();
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isSnoozeOpen, setIsSnoozeOpen] = useState(false);
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

  const handleSnooze = (date: Date | undefined) => {
    if (!date) return;
    snoozeMutation.mutate({ messageId, snoozeUntil: date });
    setIsSnoozeOpen(false);
  };

  return (
    <div className="flex items-center gap-3">
      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#9b87f5] hover:text-[#7E69AB] hover:bg-[#1A1F2C]/10"
          >
            <Reply className="h-4 w-4 mr-2" />
            Reply
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-[#1A1F2C] text-white">
          <DialogHeader>
            <DialogTitle>Reply to Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <p className="text-sm text-gray-300 mb-1">Replying to: {originalFrom}</p>
              <p className="text-sm text-gray-300 mb-4">Subject: {originalSubject}</p>
              <Textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[200px] bg-[#221F26] border-[#403E43] text-white"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSendReply}
                disabled={sendEmailMutation.isPending || !replyContent.trim()}
                className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
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
        className="text-[#9b87f5] hover:text-[#7E69AB] hover:bg-[#1A1F2C]/10"
        onClick={() => starMutation.mutate({ messageId, isStarred: !isStarred })}
      >
        <Star className={`h-4 w-4 mr-2 ${isStarred ? 'fill-[#9b87f5] text-[#9b87f5]' : ''}`} />
        Star
      </Button>

      <Popover open={isSnoozeOpen} onOpenChange={setIsSnoozeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#9b87f5] hover:text-[#7E69AB] hover:bg-[#1A1F2C]/10"
          >
            <Clock className="h-4 w-4 mr-2" />
            Snooze
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={undefined}
            onSelect={handleSnooze}
            disabled={(date) => date < new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="sm"
        className="text-[#9b87f5] hover:text-[#7E69AB] hover:bg-[#1A1F2C]/10"
        onClick={() => archiveMutation.mutate(messageId)}
      >
        <Archive className="h-4 w-4 mr-2" />
        Archive
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="text-[#9b87f5] hover:text-[#7E69AB] hover:bg-[#1A1F2C]/10"
        onClick={() => trashMutation.mutate(messageId)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Trash
      </Button>
    </div>
  );
};