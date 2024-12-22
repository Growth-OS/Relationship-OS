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

      const { error } = existingId
        ? await supabase.from("ai_prompts").update(promptData).eq("id", existingId)
        : await supabase.from("ai_prompts").insert(promptData);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["aiPrompts"] });

      toast({
        title: "Success",
        description: `Prompt ${existingId ? 'updated' : 'created'} successfully`,
      });
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast({
        title: "Error",
        description: `Failed to ${existingId ? 'update' : 'create'} prompt`,
        variant: "destructive",
      });
    }
  };

  return { handleSubmit };
};