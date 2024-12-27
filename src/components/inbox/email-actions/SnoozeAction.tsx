import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useState } from "react";
import { useSnoozeEmail } from "@/hooks/useEmailActions";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays, addWeeks, setHours, startOfTomorrow } from "date-fns";

interface SnoozeActionProps {
  messageId: string;
}

export const SnoozeAction = ({ messageId }: SnoozeActionProps) => {
  const [isSnoozeOpen, setIsSnoozeOpen] = useState(false);
  const snoozeMutation = useSnoozeEmail();

  const snoozeOptions = [
    {
      label: "Later Today",
      getDate: () => setHours(new Date(), 18),
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

  const handleSnooze = async (getDate: () => Date) => {
    try {
      const snoozeDate = getDate();
      console.log('Snoozing email until:', snoozeDate);
      await snoozeMutation.mutateAsync({ 
        messageId, 
        snoozeUntil: snoozeDate 
      });
      setIsSnoozeOpen(false);
      toast.success(`Email snoozed until ${snoozeDate.toLocaleString()}`);
    } catch (error) {
      console.error('Error snoozing email:', error);
      toast.error('Failed to snooze email');
    }
  };

  return (
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
  );
};