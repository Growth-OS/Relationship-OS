import { useQuery } from "@tanstack/react-query";
import { CreatePromptForm } from "./ai-prompts/CreatePromptForm";
import { PromptsList } from "./ai-prompts/PromptsList";
import { supabase } from "@/integrations/supabase/client";

export const AIPromptManager = () => {
  const { data: prompts, isLoading } = useQuery({
    queryKey: ["aiPrompts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_prompts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <CreatePromptForm />
      <PromptsList prompts={prompts} isLoading={isLoading} />
    </div>
  );
};