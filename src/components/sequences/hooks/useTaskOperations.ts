import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { updateSequenceProgress } from "../utils/sequenceTaskUtils";

export const useTaskOperations = () => {
  const queryClient = useQueryClient();

  const handleTaskComplete = async (taskId: string, completed: boolean, tasks: any[]) => {
    try {
      const { error: updateError } = await supabase
        .from("tasks")
        .update({ completed })
        .eq("id", taskId);

      if (updateError) throw updateError;

      // Update sequence progress if this is a sequence task
      const task = tasks.find(t => t.id === taskId);
      if (task && task.source === 'sequences') {
        await updateSequenceProgress(taskId, tasks);
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

  return { handleTaskComplete };
};