import { CreateTaskForm } from "@/components/tasks/CreateTaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { CSVUploadDialog } from "./tasks/CSVUploadDialog";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ListTodo, Upload } from "lucide-react";

interface ProjectTasksProps {
  projectId: string;
}

export const ProjectTasks = ({ projectId }: ProjectTasksProps) => {
  const queryClient = useQueryClient();

  const handleTasksImported = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  return (
    <div className="w-full">
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ListTodo className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Project Tasks</h2>
          </div>
          <div className="flex items-center gap-4">
            <CSVUploadDialog 
              projectId={projectId} 
              onSuccess={handleTasksImported}
              className="flex items-center gap-2 text-sm"
            >
              <Upload className="w-4 h-4" />
              Import Tasks
            </CSVUploadDialog>
          </div>
        </div>
        
        <Card className="p-4 bg-muted/50">
          <CreateTaskForm 
            source="projects"
            sourceId={projectId}
            onSuccess={handleSuccess}
          />
        </Card>

        <Separator className="my-6" />

        <div className="space-y-6">
          <TaskList 
            sourceId={projectId} 
            sourceType="projects" 
            showPagination={false} 
            groupBySource={false} 
          />
        </div>
      </Card>
    </div>
  );
};