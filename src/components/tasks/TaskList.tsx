import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskGroup } from "@/components/dashboard/TaskGroup";
import { TaskListSkeleton } from "./TaskListSkeleton";
import { EmptyTaskList } from "./EmptyTaskList";
import { TaskPagination } from "./TaskPagination";
import { toast } from "sonner";

type TaskSource = 'project' | 'deal' | 'sequence' | 'substack' | 'other';

interface TaskData {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  completed?: boolean;
  source?: TaskSource;
  source_id?: string;
  priority?: string;
  projects?: { id: string; name: string };
  deals?: { id: string; company_name: string };
  sequences?: { id: string; name: string };
  substack_posts?: { id: string; title: string };
}

interface TaskListProps {
  sourceType?: TaskSource;
  sourceId?: string;
  showPagination?: boolean;
  groupBySource?: boolean;
}

export const TaskList = ({ 
  sourceType, 
  sourceId, 
  showPagination = true,
  groupBySource = true 
}: TaskListProps) => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["tasks", sourceType, sourceId],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        let query = supabase
          .from("tasks")
          .select(`
            *,
            projects(id, name),
            deals(id, company_name),
            substack_posts(id, title),
            sequences(id, name)
          `)
          .eq("user_id", user.id)
          .order("due_date", { ascending: true });

        if (sourceType && sourceId) {
          query = query
            .eq("source", sourceType)
            .eq("source_id", sourceId);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching tasks:", error);
          throw error;
        }

        return {
          tasks: data || [],
          total: data?.length || 0
        };
      } catch (error) {
        console.error("Error in task query:", error);
        throw error;
      }
    },
  });

  const handleComplete = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed })
        .eq("id", taskId);

      if (error) throw error;

      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.invalidateQueries({ queryKey: ["weekly-tasks"] });
      
      toast.success(`Task ${completed ? "completed" : "uncompleted"}`);
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  if (isLoading) return <TaskListSkeleton />;
  if (!data?.tasks.length) return <EmptyTaskList />;

  // Group tasks by source if needed
  if (!groupBySource) {
    const source = sourceType || "other";
    return (
      <TaskGroup 
        source={source} 
        tasks={data.tasks}
        onComplete={handleComplete}
        onUpdate={refetch}
      />
    );
  }

  // Group tasks by their source
  const groupedTasks = data.tasks.reduce((acc, task) => {
    const taskSource = task.source || "other";
    if (!acc[taskSource]) {
      acc[taskSource] = [];
    }
    acc[taskSource].push(task);
    return acc;
  }, {} as Record<string, TaskData[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedTasks).map(([taskSource, tasks]) => (
        <TaskGroup
          key={taskSource}
          source={taskSource as any}
          tasks={tasks}
          onComplete={handleComplete}
          onUpdate={refetch}
        />
      ))}
      {showPagination && <TaskPagination total={data.total} />}
    </div>
  );
};