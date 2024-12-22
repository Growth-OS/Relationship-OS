import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreatePromptForm } from "./ai-prompts/CreatePromptForm";
import { PromptsList } from "./ai-prompts/PromptsList";
import { supabase } from "@/integrations/supabase/client";
import { AIPrompt } from "@/components/ai-prompts/types";

export const AIPromptManager = () => {
  const [promptToEdit, setPromptToEdit] = useState<AIPrompt | null>(null);

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

  const handleEditPrompt = (prompt: AIPrompt) => {
    setPromptToEdit(prompt);
  };

  const handleCancelEdit = () => {
    setPromptToEdit(null);
  };

  return (
    <div className="space-y-6">
      <CreatePromptForm 
        promptToEdit={promptToEdit} 
        onCancelEdit={handleCancelEdit}
      />
      <PromptsList 
        prompts={prompts} 
        isLoading={isLoading} 
        onEditPrompt={handleEditPrompt}
      />
    </div>
  );
};