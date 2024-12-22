import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { BasePromptForm } from "../types";

export const usePromptForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (
    promptData: BasePromptForm,
    existingId?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      // Add user_id to the prompt data
      const promptWithUser = {
        ...promptData,
        user_id: user.id,
      };

      let error;
      if (existingId) {
        console.log("Updating prompt:", existingId, promptWithUser);
        const { error: updateError } = await supabase
          .from("ai_prompts")
          .update(promptWithUser)
          .eq("id", existingId);
        error = updateError;
      } else {
        console.log("Creating new prompt:", promptWithUser);
        const { error: insertError } = await supabase
          .from("ai_prompts")
          .insert(promptWithUser);
        error = insertError;
      }

      if (error) {
        console.error("Database operation error:", error);
        throw error;
      }

      // Invalidate queries after successful operation
      await queryClient.invalidateQueries({ queryKey: ["aiPrompts"] });

      toast({
        title: "Success",
        description: `Prompt ${existingId ? 'updated' : 'created'} successfully`,
      });
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: `Failed to ${existingId ? 'update' : 'create'} prompt. ${error instanceof Error ? error.message : 'Please try again.'}`,
        variant: "destructive",
      });
      throw error; // Re-throw to let the component handle the error state
    }
  };

  return { handleSubmit };
};