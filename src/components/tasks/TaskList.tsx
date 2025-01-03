import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TaskCard } from "./TaskCard";
import { TaskListSkeleton } from "./TaskListSkeleton";
import { EmptyTaskList } from "./EmptyTaskList";
import { TaskSource } from "@/integrations/supabase/types/tasks";

interface TaskListProps {
  source?: TaskSource;
  projectId?: string;
  showArchived?: boolean;
}

export const TaskList = ({ source, projectId, showArchived = false }: TaskListProps) => {
  const { data: tasks = [], isLoading, error, refetch } = useQuery({
    queryKey: ["tasks", source, projectId, showArchived],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      let query = supabase
        .from("tasks")
        .select(`
          *,
          projects(id, name),
          deals!tasks_deal_id_fkey(id, company_name),
          substack_posts(id, title)
        `)
        .eq('user_id', user.user.id);

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

      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }

      return data || [];
    },
  });

  const handleComplete = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed })
        .eq("id", taskId);

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
    return <TaskListSkeleton />;
  }

  if (error) {
    return (
      <div className="text-sm text-red-500 p-4 bg-red-50 rounded-lg max-w-3xl">
        Error loading tasks. Please try again.
      </div>
    );
  }

  if (tasks.length === 0) {
    return <EmptyTaskList />;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task}
          onComplete={handleComplete}
        />
      ))}
    </div>
  );
};