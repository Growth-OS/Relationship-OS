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
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as AIPrompt | null;
    },
  });
};