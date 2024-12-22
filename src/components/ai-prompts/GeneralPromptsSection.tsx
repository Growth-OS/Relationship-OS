import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CreatePromptForm } from "./components/CreatePromptForm";
import { PromptsTable } from "./components/PromptsTable";
import { AIPrompt } from "./types";

export const GeneralPromptsSection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to fetch all general prompts
  const { data: prompts, isLoading, error } = useQuery<AIPrompt[]>({
    queryKey: ["aiPrompts", "general_prompt"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_prompts")
        .select("*")
        .eq("category", "general_prompt")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  // Delete mutation
  const deletePromptMutation = useMutation({
    mutationFn: async (promptId: string) => {
      const { error } = await supabase
        .from("ai_prompts")
        .delete()
        .eq("id", promptId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiPrompts"] });
      toast({
        title: "Success",
        description: "Prompt deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete prompt",
        variant: "destructive",
      });
      console.error("Error deleting prompt:", error);
    },
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load prompts",
      variant: "destructive",
    });
  }

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["aiPrompts"] });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <CardTitle>AI Prompts</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <CreatePromptForm onSuccess={handleFormSuccess} />
        <PromptsTable 
          prompts={prompts || []}
          isLoading={isLoading}
          onDelete={(id) => deletePromptMutation.mutate(id)}
          isDeleting={deletePromptMutation.isPending}
        />
      </CardContent>
    </Card>
  );
};