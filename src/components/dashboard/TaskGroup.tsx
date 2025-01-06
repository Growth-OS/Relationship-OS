import { memo } from 'react';
import { TaskCard } from "@/components/tasks/TaskCard";

interface TaskGroupProps {
  source: string;
  tasks: any[];
  onComplete: (taskId: string, completed: boolean) => Promise<void>;
  onUpdate: () => void;
}

export const TaskGroup = memo(({ source, tasks, onComplete, onUpdate }: TaskGroupProps) => {
  const getSourceTitle = (source: string) => {
    const titles: Record<string, string> = {
      deals: "Sales Tasks",
      content: "Content Tasks",
      ideas: "Ideas Tasks",
      substack: "Substack Tasks",
      projects: "Project Tasks",
      sequences: "Sequence Tasks",
      other: "Other Tasks"
    };
    return titles[source] || "Tasks";
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">
        {getSourceTitle(source)}
      </h3>
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
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.source === nextProps.source &&
    prevProps.tasks.length === nextProps.tasks.length &&
    prevProps.tasks.every((task, index) => 
      task.id === nextProps.tasks[index].id &&
      task.completed === nextProps.tasks[index].completed
    )
  );
});

TaskGroup.displayName = 'TaskGroup';