import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TaskData } from "../types";

export const useTaskOperations = () => {
  const queryClient = useQueryClient();

  const handleTaskComplete = async (taskId: string, completed: boolean, tasks: TaskData[]) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed })
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