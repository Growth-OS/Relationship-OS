import { Eye, MousePointer } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";

interface EmailTrackingIndicatorsProps {
  emailId: string;
  trackingEvents?: {
    event_type: string;
    occurred_at: string;
  }[];
}

export const EmailTrackingIndicators = ({ emailId, trackingEvents = [] }: EmailTrackingIndicatorsProps) => {
  const openEvents = trackingEvents.filter(event => event.event_type === 'mail_opened');
  const clickEvents = trackingEvents.filter(event => event.event_type === 'mail_link_clicked');

  if (!openEvents.length && !clickEvents.length) return null;

  return (
    <div className="flex gap-2">
      <TooltipProvider>
        {openEvents.length > 0 && (
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Eye className="w-4 h-4" />
                <span>{openEvents.length}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Opened {openEvents.length} times</p>
              <p className="text-xs text-gray-500">
                Last opened {formatDistanceToNow(new Date(openEvents[0].occurred_at), { addSuffix: true })}
              </p>
            </TooltipContent>
          </Tooltip>
        )}

        {clickEvents.length > 0 && (
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MousePointer className="w-4 h-4" />
                <span>{clickEvents.length}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Links clicked {clickEvents.length} times</p>
              <p className="text-xs text-gray-500">
                Last clicked {formatDistanceToNow(new Date(clickEvents[0].occurred_at), { addSuffix: true })}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};