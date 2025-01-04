import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { TaskGroup } from "./TaskGroup";
import { updateSequenceProgress } from "@/components/sequences/utils/sequenceTaskUtils";

export const DashboardWeeklyTasks = () => {
  const queryClient = useQueryClient();
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["weekly-tasks"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          projects(id, name),
          deals(id, company_name),
          substack_posts(id, title),
          sequences(id, name)
        `)
        .eq("user_id", user.user.id)
        .eq("completed", false)
        .gte("due_date", startDate.toISOString())
        .lte("due_date", endDate.toISOString())
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleTaskComplete = async (taskId: string, completed: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from("tasks")
        .update({ completed })
        .eq("id", taskId);

      if (updateError) throw updateError;

      // Update sequence progress if this is a sequence task
      if (tasks) {
        const task = tasks.find(t => t.id === taskId);
        if (task && task.source === 'sequences') {
          await updateSequenceProgress(taskId, tasks);
        }
      }

      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["weekly-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["sequences"] });
      
      toast.success("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
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
  }, {} as Record<string, typeof tasks>);

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
            source={source}
            tasks={sourceTasks}
            onComplete={handleTaskComplete}
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