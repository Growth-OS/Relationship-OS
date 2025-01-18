import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { EditTaskDialog } from "./EditTaskDialog";
import { useNavigate } from "react-router-dom";
import { memo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PriorityBadge } from "./components/PriorityBadge";
import { TaskDetails } from "./components/TaskDetails";
import { TaskData } from "./types";

interface TaskCardProps {
  task: TaskData;
  onComplete: (taskId: string, completed: boolean) => Promise<void>;
  onUpdate: () => void;
}

export const TaskCard = memo(({ task, onComplete, onUpdate }: TaskCardProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleTaskClick = (task: TaskData) => {
    if (task.source === 'projects' && task.projects) {
      navigate(`/dashboard/projects?id=${task.projects.id}`);
    } else if (task.source === 'deals' && task.deals) {
      navigate(`/dashboard/deals?id=${task.deals.id}`);
    } else if (task.source === 'substack' && task.substack_posts) {
      navigate(`/dashboard/substack?id=${task.substack_posts.id}`);
    } else if (task.source === 'sequences' && task.sequence_id) {
      navigate(`/dashboard/sequences/${task.sequence_id}/edit`);
    } else if (task.source === 'ideas') {
      navigate('/dashboard/development');
    }
  };

  const handleComplete = async (checked: boolean) => {
    // Optimistically update the UI
    queryClient.setQueryData(['weekly-tasks'], (oldData: any) => {
      if (!oldData) return oldData;
      return oldData.map((t: any) => 
        t.id === task.id ? { ...t, completed: checked } : t
      );
    });

    // Make the API call
    await onComplete(task.id, checked);
    
    // Invalidate relevant queries to ensure data consistency
    queryClient.invalidateQueries({ queryKey: ['weekly-tasks'] });
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

  return (
    <Card 
      className={cn(
        "p-4 hover:shadow-md transition-all duration-200 cursor-pointer group max-w-3xl",
        task.completed ? "bg-gray-50" : "bg-white"
      )}
      onClick={() => handleTaskClick(task)}
    >
      <div className="flex items-start gap-4">
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="pt-1"
        >
          <Checkbox
            checked={task.completed || false}
            onCheckedChange={handleComplete}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1 min-w-0 text-left">
              <h3 className={cn(
                "font-medium truncate",
                task.completed && "text-gray-500 line-through"
              )}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {task.priority && (
                <PriorityBadge priority={task.priority} />
              )}
              <div 
                onClick={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <EditTaskDialog task={task} onUpdate={onUpdate} />
              </div>
            </div>
          </div>

          <TaskDetails task={task} />
        </div>

        {task.completed && (
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
        )}
      </div>
    </Card>
  );
});

TaskCard.displayName = 'TaskCard';