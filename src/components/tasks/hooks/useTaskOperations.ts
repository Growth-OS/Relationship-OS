import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TaskData } from "../types";
import { addMonths, addWeeks, addDays } from "date-fns";

export const useTaskOperations = () => {
  const queryClient = useQueryClient();

  const calculateNextOccurrence = (task: TaskData) => {
    if (!task.due_date || !task.recurrence_interval) return null;
    
    const currentDate = new Date(task.due_date);
    
    switch (task.recurrence_interval) {
      case 'monthly':
        return addMonths(currentDate, 1).toISOString().split('T')[0];
      case 'weekly':
        return addWeeks(currentDate, 1).toISOString().split('T')[0];
      case 'daily':
        return addDays(currentDate, 1).toISOString().split('T')[0];
      default:
        return null;
    }
  };

  const handleTaskComplete = async (taskId: string, completed: boolean, tasks: TaskData[]) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error("Task not found");

      let updateData: any = { completed };

      if (completed && task.is_recurring) {
        const nextOccurrence = calculateNextOccurrence(task);
        if (nextOccurrence) {
          // Create new recurring task
          const { error: createError } = await supabase
            .from("tasks")
            .insert([{
              title: task.title,
              description: task.description,
              due_date: nextOccurrence,
              priority: task.priority,
              source: task.source,
              source_id: task.source_id,
              is_recurring: true,
              recurrence_interval: task.recurrence_interval,
              user_id: task.user_id,
            }]);

          if (createError) throw createError;
        }
      }

      const { error } = await supabase
        .from("tasks")
        .update({
          ...updateData,
          last_completed_date: completed ? new Date().toISOString() : null
        })
        .eq("id", taskId);

      if (error) throw error;

      // Optimistically update the UI
      queryClient.setQueryData(["weekly-tasks"], (oldData: any) => {
        if (!oldData) return oldData;
        return tasks.map(task => 
          task.id === taskId ? { ...task, completed } : task
        );
      });

      toast.success(completed ? "Task completed" : "Task uncompleted");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const handleTaskUpdate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    await queryClient.invalidateQueries({ queryKey: ["weekly-tasks"] });
  };

  return { handleTaskComplete, handleTaskUpdate };
};