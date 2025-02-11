import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskGroup } from "./TaskGroup";
import { useTaskOperations } from "@/components/tasks/hooks/useTaskOperations";
import { TaskData, TaskSource } from "@/components/tasks/types";
import { toast } from "sonner";

export const DashboardWeeklyTasks = () => {
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });
  const queryClient = useQueryClient();
  const { handleTaskComplete, handleTaskUpdate } = useTaskOperations();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["weekly-tasks", startDate, endDate],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      console.log("Fetching weekly tasks...");

      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          projects(id, name),
          deals(id, company_name),
          substack_posts(id, title)
        `)
        .eq("user_id", user.user.id)
        .eq("completed", false)  // Only fetch incomplete tasks
        .gte("due_date", startDate.toISOString())
        .lte("due_date", endDate.toISOString())
        .order("due_date", { ascending: true });
      
      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }

      console.log("Fetched tasks:", data);
      return data as TaskData[];
    },
  });

  const handleTaskCompleteWithRefresh = async (taskId: string, completed: boolean) => {
    try {
      // Optimistically update the UI
      queryClient.setQueryData(["weekly-tasks", startDate, endDate], (oldData: TaskData[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(task => 
          task.id === taskId ? { ...task, completed } : task
        );
      });

      // Make the API call
      await handleTaskComplete(taskId, completed, tasks || []);
      
      // Show success notification
      toast.success(completed ? "Task completed" : "Task uncompleted");

      // Invalidate and refetch to ensure data consistency
      await queryClient.invalidateQueries({ 
        queryKey: ["weekly-tasks"],
        refetchType: "none" // Prevent automatic refetch which causes scroll jump
      });
    } catch (error) {
      console.error("Error completing task:", error);
      // Show error notification
      toast.error("Failed to update task");
      // Revert optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["weekly-tasks"] });
    }
  };

  // Group tasks by source
  const groupedTasks = tasks?.reduce((acc, task) => {
    const source = task.source || "other";
    if (!acc[source]) {
      acc[source] = [];
    }
    acc[source].push(task);
    return acc;
  }, {} as Record<string, TaskData[]>);

  if (isLoading) {
    return (
      <Card className="p-4 space-y-4 bg-background border">
        <div className="space-y-3">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-background border h-[calc(100vh-16rem)] overflow-auto">
      <h2 className="text-lg font-semibold mb-4">
        This Week ({format(startDate, "MMM d")} - {format(endDate, "MMM d")})
      </h2>
      
      <div className="space-y-6">
        {groupedTasks && Object.entries(groupedTasks).map(([source, sourceTasks]) => (
          <TaskGroup
            key={source}
            source={source as TaskSource}
            tasks={sourceTasks || []}
            onComplete={handleTaskCompleteWithRefresh}
            onUpdate={handleTaskUpdate}
          />
        ))}
        
        {(!tasks || tasks.length === 0) && (
          <div className="text-center py-6 text-muted-foreground">
            No tasks due this week
          </div>
        )}
      </div>
    </Card>
  );
};