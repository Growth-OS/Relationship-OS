import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { TaskData } from "../types";

interface TaskDetailsProps {
  task: TaskData;
}

export const TaskDetails = ({ task }: TaskDetailsProps) => {
  return (
    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
      {task.due_date && (
        <div className="flex items-center gap-1.5">
          <CalendarIcon className="w-4 h-4" />
          <span>Due {format(new Date(task.due_date), 'MMM d, yyyy')}</span>
        </div>
      )}
      {task.projects?.name && (
        <Badge variant="outline" className="text-blue-600">
          {task.projects.name}
        </Badge>
      )}
      {task.deals?.company_name && (
        <Badge variant="outline" className="text-green-600">
          {task.deals.company_name}
        </Badge>
      )}
      {task.source === 'outreach' && task.outreach_campaigns?.name && (
        <Badge variant="outline" className="text-purple-600">
          Campaign: {task.outreach_campaigns.name}
        </Badge>
      )}
    </div>
  );
};