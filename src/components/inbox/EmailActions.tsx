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
import { addDays } from "date-fns";

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
        onClick={() => starMutation.mutate({ messageId, isStarred: !isStarred })}
      >
        <Star className={`w-4 h-4 ${isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
        Star
      </Button>

      <Popover open={isSnoozeOpen} onOpenChange={setIsSnoozeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <Clock className="w-4 h-4" />
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
        className="gap-2"
        onClick={() => archiveMutation.mutate(messageId)}
      >
        <Archive className="w-4 h-4" />
        Archive
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={() => trashMutation.mutate(messageId)}
      >
        <Trash2 className="w-4 h-4" />
        Trash
      </Button>
    </div>
  );
};