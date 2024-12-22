import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BasePromptForm } from "../types";

export const usePromptForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (promptData: BasePromptForm & { user_id?: string }, existingId?: string) => {
    try {
      setIsSubmitting(true);

      // Get the current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error("You must be logged in to perform this action");
      }

      // Add user_id to the prompt data
      const dataWithUser = {
        ...promptData,
        user_id: user.id,
      };

      let error;
      if (existingId) {
        // Update existing prompt
        ({ error } = await supabase
          .from("ai_prompts")
          .update(dataWithUser)
          .eq("id", existingId));
      } else {
        // Create new prompt
        ({ error } = await supabase
          .from("ai_prompts")
          .insert([dataWithUser]));
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Prompt ${existingId ? "updated" : "created"} successfully`,
      });

      return true;
    } catch (error) {
      console.error("Error submitting prompt:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit prompt",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
  };
};