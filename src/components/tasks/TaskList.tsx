import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { EditTaskDialog } from "./EditTaskDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface TaskListProps {
  source?: "other" | "deals" | "content" | "ideas" | "substack" | "projects";
  projectId?: string;
  showArchived?: boolean;
}

export const TaskList = ({ source, projectId, showArchived = false }: TaskListProps) => {
  const { data: tasks = [], isLoading, error, refetch } = useQuery({
    queryKey: ["tasks", source, projectId, showArchived],
    queryFn: async () => {
      try {
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

        const { data, error } = await query
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .order('due_date', { ascending: true });

        if (error) {
          console.error("Error fetching tasks:", error);
          throw error;
        }

        return data || [];
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
        toast.error("Failed to load tasks. Please try again.");
        throw err;
      }
    },
    retry: 1,
  });

  const handleComplete = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed })
        .eq("id", taskId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) {
        console.error("Error updating task:", error);
        toast.error("Failed to update task status");
        return;
      }

      toast.success(completed ? "Task marked as complete" : "Task marked as incomplete");
      refetch();
    } catch (err) {
      console.error("Failed to update task:", err);
      toast.error("Failed to update task status");
    }
  };

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">Error loading tasks. Please try again.</div>;
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
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={task.completed || false}
                  onCheckedChange={(checked) => handleComplete(task.id, checked as boolean)}
                  className="mt-1"
                />
                <div className="flex-1">
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
              </div>
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