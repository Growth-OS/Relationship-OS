import { CreateTaskForm } from "@/components/tasks/CreateTaskForm";
import { TaskList } from "@/components/tasks/TaskList";

interface ProjectTasksProps {
  projectId: string;
}

export const ProjectTasks = ({ projectId }: ProjectTasksProps) => {
  return (
    <div className="space-y-6">
      <CreateTaskForm projectId={projectId} source="other" />
      <TaskList source="other" />
    </div>
  );
};