import { Card } from "@/components/ui/card";
import { TaskCard } from "@/components/tasks/TaskCard";
import { getSourceIcon } from "@/components/tasks/utils";

interface TaskData {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  completed?: boolean;
  priority?: string;
  projects?: { id: string; name: string };
  deals?: { id: string; company_name: string };
  sequences?: { id: string; name: string };
  substack_posts?: { id: string; title: string };
}

export interface TaskGroupProps {
  source: string;
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