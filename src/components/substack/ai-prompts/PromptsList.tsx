import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Prompt = Tables<"ai_prompts">;

interface PromptsListProps {
  prompts: Prompt[] | undefined;
  isLoading: boolean;
}

export const PromptsList = ({ prompts, isLoading }: PromptsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  if (isLoading) {
    return <p>Loading prompts...</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {prompts?.map((prompt) => (
        <Card key={prompt.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{prompt.title}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deletePromptMutation.mutate(prompt.id)}
                disabled={deletePromptMutation.isPending}
              >
                <Trash className="w-4 h-4 text-destructive" />
              </Button>
            </div>
            {prompt.category && (
              <CardDescription>{prompt.category}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {prompt.system_prompt}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};