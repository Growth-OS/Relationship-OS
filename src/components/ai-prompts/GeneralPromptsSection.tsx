import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CreatePromptForm } from "./components/CreatePromptForm";
import { PromptsTable } from "./components/PromptsTable";
import { AIPrompt } from "./types";
import { useEffect } from "react";

export const GeneralPromptsSection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  useEffect(() => {
    const initializeTemplates = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Auth error:', authError);
        return;
      }

      const { error } = await supabase.rpc('insert_prompt_templates_for_user', {
        user_id: user.id
      });

      if (error) {
        console.error('Error initializing templates:', error);
        toast({
          title: "Error",
          description: "Failed to initialize prompt templates",
          variant: "destructive",
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["aiPrompts"] });
      }
    };

    initializeTemplates();
  }, [toast, queryClient]);

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
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-lg font-medium">Prompts</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-0">
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