import { CreateTaskForm } from "@/components/tasks/CreateTaskForm";
import { TaskList } from "@/components/tasks/TaskList";

export const ProjectTasks = ({ projectId }: { projectId: string }) => {
  return (
    <div className="space-y-6">
      <CreateTaskForm projectId={projectId} source="projects" />
      <TaskList projectId={projectId} />
    </div>
  );
};