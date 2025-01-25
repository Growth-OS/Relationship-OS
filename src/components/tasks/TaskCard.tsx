import { CheckCircle2, MoreHorizontal } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

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
    } else if (task.source === 'outreach') {
      navigate('/dashboard/outreach');
    } else if (task.source === 'ideas') {
      navigate('/dashboard/development');
    }
  };

  const handleComplete = async (checked: boolean) => {
    queryClient.setQueryData(['weekly-tasks'], (oldData: any) => {
      if (!oldData) return oldData;
      return oldData.map((t: any) => 
        t.id === task.id ? { ...t, completed: checked } : t
      );
    });

    await onComplete(task.id, checked);
    queryClient.invalidateQueries({ queryKey: ['weekly-tasks'] });
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  };

  return (
    <Card 
      className={cn(
        "p-4 hover:shadow-sm transition-all duration-200 cursor-pointer group",
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
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="space-y-1 flex-1 min-w-0">
              <h3 className={cn(
                "font-medium",
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
              <PriorityBadge priority={task.priority || 'medium'} />
              <div 
                onClick={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              {task.due_date && (
                <span>{new Date(task.due_date).toLocaleDateString()}</span>
              )}
              <div className="flex -space-x-2">
                <Avatar className="h-6 w-6 border-2 border-white">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar className="h-6 w-6 border-2 border-white">
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
              </div>
            </div>
            <Progress value={task.completed ? 100 : 0} className="w-20 h-1" />
          </div>
        </div>
      </div>
    </Card>
  );
});

TaskCard.displayName = 'TaskCard';