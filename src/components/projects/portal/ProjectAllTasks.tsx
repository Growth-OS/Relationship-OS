import { Card } from "@/components/ui/card";
import { TaskList } from "@/components/tasks/TaskList";
import { ListTodo } from "lucide-react";

interface ProjectAllTasksProps {
  projectId: string;
}

export const ProjectAllTasks = ({ projectId }: ProjectAllTasksProps) => {
  return (
    <div className="w-full">
      <Card className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ListTodo className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">All Project Tasks</h2>
        </div>
        
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