import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskGroup } from "@/components/dashboard/TaskGroup";
import { TaskListSkeleton } from "./TaskListSkeleton";
import { EmptyTaskList } from "./EmptyTaskList";
import { TaskPagination } from "./TaskPagination";
import { toast } from "sonner";
import { TaskData, TaskListProps, TaskSource } from "./types";

export const TaskList = ({ 
  sourceType, 
  sourceId, 
  showPagination = true,
  groupBySource = true,
  showArchived = false 
}: TaskListProps) => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["tasks", sourceType, sourceId, showArchived],
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
          .eq("completed", showArchived); // Only show completed tasks in archived view

        // If sourceType is provided and not in archived view, filter by source type
        if (sourceType && !showArchived) {
          query = query.eq("source", sourceType);
        }

        if (sourceId) {
          query = query.eq("source_id", sourceId);
        }

        query = query.order("due_date", { ascending: true });

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

      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      await queryClient.invalidateQueries({ queryKey: ["weekly-tasks"] });
      
      toast.success(`Task ${completed ? "archived" : "unarchived"}`);
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleUpdate = async () => {
    await refetch();
  };

  if (isLoading) return <TaskListSkeleton />;
  if (!data?.tasks.length) return <EmptyTaskList />;

  if (!groupBySource) {
    const source = sourceType || "other";
    return (
      <TaskGroup 
        source={source} 
        tasks={data.tasks}
        onComplete={handleComplete}
        onUpdate={handleUpdate}
      />
    );
  }

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
          source={taskSource}
          tasks={tasks}
          onComplete={handleComplete}
          onUpdate={handleUpdate}
        />
      ))}
      {showPagination && data.total > 0 && (
        <TaskPagination 
          currentPage={1} 
          totalPages={Math.ceil(data.total / 10)}
          onPageChange={() => {}}
        />
      )}
    </div>
  );
};