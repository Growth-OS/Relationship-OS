import { Card } from "@/components/ui/card";
import { TaskCard } from "@/components/tasks/TaskCard";
import { getSourceIcon } from "@/components/tasks/utils";
import { TaskData, TaskSource } from "@/components/tasks/types";

export interface TaskGroupProps {
  source: TaskSource;
  tasks: TaskData[];
  onComplete: (taskId: string, completed: boolean) => Promise<void>;
  onUpdate: () => Promise<void>;
}

export const TaskGroup = ({ source, tasks, onComplete, onUpdate }: TaskGroupProps) => {
  const Icon = getSourceIcon(source);
  const sourceTitle = source.charAt(0).toUpperCase() + source.slice(1);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">{sourceTitle}</h3>
        <span className="text-sm text-muted-foreground">({tasks.length})</span>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
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