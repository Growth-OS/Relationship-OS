import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { startOfWeek, endOfWeek, format, addDays } from "date-fns";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
          substack_posts(id, title)
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

      // If this is a sequence task, update the sequence progress
      const task = tasks?.find(t => t.id === taskId);
      if (task?.source === 'other' && task.title.includes('sequence')) {
        const sequenceName = task.title.match(/sequence "([^"]+)"/)?.[1];
        if (sequenceName) {
          // First, get the sequence
          const { data: sequences } = await supabase
            .from('sequences')
            .select('id')
            .eq('name', sequenceName)
            .single();

          if (sequences) {
            // Get all prospects that are in this sequence
            const { data: assignments } = await supabase
              .from('sequence_assignments')
              .select(`
                *,
                sequence:sequences(
                  id,
                  sequence_steps(*)
                )
              `)
              .eq('sequence_id', sequences.id);

            // Update each assignment's current step
            if (assignments && assignments.length > 0) {
              const updatePromises = assignments.map(async assignment => {
                const nextStep = assignment.current_step + 1;
                const steps = assignment.sequence.sequence_steps;
                
                // Find the next step's delay_days
                const nextStepData = steps.find(s => s.step_number === nextStep);
                const dueDate = nextStepData 
                  ? addDays(new Date(), nextStepData.delay_days).toISOString()
                  : null;

                // Update the assignment
                await supabase
                  .from('sequence_assignments')
                  .update({ 
                    current_step: nextStep,
                    status: nextStep >= steps.length ? 'completed' : 'active'
                  })
                  .eq('id', assignment.id);

                // If there's a next step, create a task for it
                if (nextStepData) {
                  const { data: { user } } = await supabase.auth.getUser();
                  if (!user) throw new Error("Not authenticated");

                  const actionType = nextStepData.step_type === 'email' ? 'Send email' : 
                                   nextStepData.step_type === 'linkedin_connection' ? 'Send LinkedIn connection request' : 
                                   'Send LinkedIn message';

                  await supabase
                    .from("tasks")
                    .insert({
                      title: `${actionType} for sequence "${sequenceName}" - Step ${nextStep}`,
                      description: nextStepData.message_template,
                      due_date: dueDate,
                      source: 'other',
                      priority: 'medium',
                      user_id: user.id
                    });
                }
              });

              await Promise.all(updatePromises);
            }
          }
        }
      }

      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["weekly-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
      
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

  const getSourceTitle = (source: string) => {
    const titles: Record<string, string> = {
      deals: "Sales Tasks",
      content: "Content Tasks",
      ideas: "Ideas Tasks",
      substack: "Substack Tasks",
      projects: "Project Tasks",
      other: "Other Tasks"
    };
    return titles[source] || "Tasks";
  };

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
          <div key={source} className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              {getSourceTitle(source)}
            </h3>
            <div className="space-y-2">
              {sourceTasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task}
                  onComplete={handleTaskComplete}
                />
              ))}
            </div>
          </div>
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