import { Card } from "@/components/ui/card";
import { TaskCard } from "@/components/tasks/TaskCard";
import { getSourceIcon } from "@/components/tasks/utils";
import { TaskData, TaskSource } from "@/components/tasks/types";
import { Users } from "lucide-react";

export interface TaskGroupProps {
  source: TaskSource;
  tasks: TaskData[];
  onComplete: (taskId: string, completed: boolean) => Promise<void>;
  onUpdate: () => Promise<void>;
}

export const TaskGroup = ({ source, tasks, onComplete, onUpdate }: TaskGroupProps) => {
  const Icon = source === 'outreach' ? Users : getSourceIcon(source);
  const sourceTitle = source === 'outreach' ? 'Outreach Tasks' : source.charAt(0).toUpperCase() + source.slice(1);

  // Sort tasks by due date (null dates at the end)
  const sortedTasks = [...tasks].sort((a, b) => {
    // If either task doesn't have a due date, put it at the end
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    
    // Compare dates
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">{sourceTitle}</h3>
        <span className="text-sm text-muted-foreground">({tasks.length})</span>
      </div>
      <div className="space-y-2">
        {sortedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onComplete={onComplete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </Card>
  );
};