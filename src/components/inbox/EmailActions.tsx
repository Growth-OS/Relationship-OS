import { ReplyAction } from "./email-actions/ReplyAction";
import { StarAction } from "./email-actions/StarAction";
import { SnoozeAction } from "./email-actions/SnoozeAction";
import { ArchiveAction } from "./email-actions/ArchiveAction";
import { TrashAction } from "./email-actions/TrashAction";

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
  return (
    <div className="flex items-center gap-3">
      <ReplyAction
        messageId={messageId}
        originalSubject={originalSubject}
        originalFrom={originalFrom}
      />
      <StarAction messageId={messageId} isStarred={isStarred} />
      <SnoozeAction messageId={messageId} />
      <ArchiveAction messageId={messageId} />
      <TrashAction messageId={messageId} />
    </div>
  );
};