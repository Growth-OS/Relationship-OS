import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const AIPromptManager = () => {
  const [title, setTitle] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [category, setCategory] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const createPromptMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("ai_prompts").insert({
        title,
        system_prompt: systemPrompt,
        category,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiPrompts"] });
      setTitle("");
      setSystemPrompt("");
      setCategory("");
      toast({
        title: "Success",
        description: "Prompt created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create prompt",
        variant: "destructive",
      });
      console.error("Error creating prompt:", error);
    },
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPromptMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Create New Prompt</CardTitle>
            <CardDescription>
              Add a new AI prompt template for generating content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Prompt Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                placeholder="Category (optional)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div>
              <Textarea
                placeholder="System Prompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                required
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={createPromptMutation.isPending}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              {createPromptMutation.isPending ? "Creating..." : "Create Prompt"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
          <p>Loading prompts...</p>
        ) : (
          prompts?.map((prompt) => (
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
          ))
        )}
      </div>
    </div>
  );
};