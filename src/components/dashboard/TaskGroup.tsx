import { Card } from "@/components/ui/card";
import { TaskCard } from "@/components/tasks/TaskCard";
import { getSourceIcon } from "@/components/tasks/utils";
import { TaskData, TaskSource } from "@/components/tasks/types";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  return (
    <Card className="p-6 bg-card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">{sourceTitle}</h3>
          <Badge variant="secondary" className="ml-2">
            {tasks.length}
          </Badge>
        </div>
      </div>
      
      <div className="grid gap-4">
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