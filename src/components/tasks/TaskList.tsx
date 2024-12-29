import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { EditTaskDialog } from "./EditTaskDialog";

interface TaskListProps {
  source?: "other" | "deals" | "content" | "ideas" | "substack" | "projects";
  projectId?: string;
  showArchived?: boolean;
}

export const TaskList = ({ source, projectId, showArchived = false }: TaskListProps) => {
  const { data: tasks = [], isLoading, refetch } = useQuery({
    queryKey: ["tasks", source, projectId, showArchived],
    queryFn: async () => {
      let query = supabase
        .from("tasks")
        .select("*");

      if (source) {
        query = query.eq("source", source);
      }

      if (projectId) {
        query = query.eq("project_id", projectId);
      }

      if (!showArchived) {
        query = query.eq("completed", false);
      }

      const { data, error } = await query.order('due_date', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return <div className="text-sm text-gray-500 text-left">No tasks found</div>;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card 
          key={task.id} 
          className={cn(
            "p-4 hover:shadow-md transition-shadow",
            task.completed ? "bg-gray-50" : "bg-white"
          )}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1 text-left flex-1">
              <div className="flex items-start justify-between">
                <h3 className={cn(
                  "font-medium",
                  task.completed && "text-gray-500 line-through"
                )}>
                  {task.title}
                </h3>
                <EditTaskDialog task={task} onUpdate={refetch} />
              </div>
              {task.description && (
                <p className="text-sm text-gray-600">{task.description}</p>
              )}
              {task.due_date && (
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <CalendarIcon className="w-4 h-4 mr-1" />
                  <span>Due {format(new Date(task.due_date), 'MMM d, yyyy')}</span>
                </div>
              )}
            </div>
            {task.completed && (
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};