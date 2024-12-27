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
import { useState } from "react";
import { useEmailMutation } from "@/hooks/useEmailMutation";
import { Textarea } from "@/components/ui/textarea";
import { addDays, addWeeks, setHours, startOfTomorrow } from "date-fns";

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

  const snoozeOptions = [
    {
      label: "Later Today",
      getDate: () => setHours(new Date(), 18), // 6 PM today
    },
    {
      label: "Tomorrow",
      getDate: () => startOfTomorrow(),
    },
    {
      label: "This Weekend",
      getDate: () => {
        const today = new Date();
        const daysUntilSaturday = 6 - today.getDay();
        return addDays(today, daysUntilSaturday);
      },
    },
    {
      label: "Next Week",
      getDate: () => addWeeks(new Date(), 1),
    },
    {
      label: "In a Month",
      getDate: () => addDays(new Date(), 30),
    },
  ];

  const handleSnooze = (getDate: () => Date) => {
    const snoozeDate = getDate();
    snoozeMutation.mutate({ messageId, snoozeUntil: snoozeDate });
    setIsSnoozeOpen(false);
  };

  return (
    <div className="flex items-center gap-3">
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

      <Button
        variant="ghost"
        size="sm"
        className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        onClick={() => starMutation.mutate({ messageId, isStarred: !isStarred })}
      >
        <Star className={`h-4 w-4 mr-2 ${isStarred ? 'fill-gray-900 text-gray-900' : ''}`} />
        Star
      </Button>

      <Popover open={isSnoozeOpen} onOpenChange={setIsSnoozeOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <Clock className="h-4 w-4 mr-2" />
            Snooze
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-0 bg-white" align="start">
          <div className="py-2">
            {snoozeOptions.map((option) => (
              <Button
                key={option.label}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-none"
                onClick={() => handleSnooze(option.getDate)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="sm"
        className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        onClick={() => archiveMutation.mutate(messageId)}
      >
        <Archive className="h-4 w-4 mr-2" />
        Archive
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        onClick={() => trashMutation.mutate(messageId)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Trash
      </Button>
    </div>
  );
};