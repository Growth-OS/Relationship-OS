import { CreateTaskForm } from "@/components/tasks/CreateTaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { CSVUploadDialog } from "./tasks/CSVUploadDialog";
import { useQueryClient } from "@tanstack/react-query";

interface ProjectTasksProps {
  projectId: string;
}

export const ProjectTasks = ({ projectId }: ProjectTasksProps) => {
  const queryClient = useQueryClient();

  const handleTasksImported = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <CreateTaskForm projectId={projectId} source="projects" />
        <CSVUploadDialog projectId={projectId} onSuccess={handleTasksImported} />
      </div>
      <TaskList sourceId={projectId} sourceType="projects" showPagination={false} groupBySource={false} />
    </div>
  );
};