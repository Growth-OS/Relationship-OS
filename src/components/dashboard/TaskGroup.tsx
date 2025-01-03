import { TaskCard } from "@/components/tasks/TaskCard";

interface TaskGroupProps {
  source: string;
  tasks: any[];
  onComplete: (taskId: string, completed: boolean) => Promise<void>;
}

export const TaskGroup = ({ source, tasks, onComplete }: TaskGroupProps) => {
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
          />
        ))}
      </div>
    </div>
  );
};