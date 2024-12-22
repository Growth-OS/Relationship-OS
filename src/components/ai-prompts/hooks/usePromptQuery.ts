import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AIPrompt } from "../types";

export const usePromptQuery = (category: string) => {
  return useQuery({
    queryKey: ["aiPrompts", category],
    queryFn: async () => {
      // Get the current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error("You must be logged in to view prompts");
      }

      const { data, error } = await supabase
        .from("ai_prompts")
        .select("*")
        .eq("category", category)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data as AIPrompt[];
    },
  });
};