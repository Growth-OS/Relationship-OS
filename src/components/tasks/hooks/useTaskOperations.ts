import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useTaskOperations = () => {
  const queryClient = useQueryClient();

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
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  return {
    handleComplete,
    handleUpdate
  };
};