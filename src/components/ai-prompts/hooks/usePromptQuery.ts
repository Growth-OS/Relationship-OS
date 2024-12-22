import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { AIPrompt } from "../types";

export const usePromptQuery = (category: string) => {
  return useQuery({
    queryKey: ["aiPrompts", category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_prompts")
        .select("*")
        .eq("category", category)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data as AIPrompt | null;
    },
  });
};