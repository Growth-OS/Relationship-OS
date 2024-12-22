import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Save } from "lucide-react";
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

interface CreatePromptFormProps {
  promptToEdit?: {
    id: string;
    title: string;
    system_prompt: string;
    category: string;
  } | null;
  onCancelEdit?: () => void;
}

export const CreatePromptForm = ({ promptToEdit, onCancelEdit }: CreatePromptFormProps) => {
  const [title, setTitle] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [category, setCategory] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (promptToEdit) {
      setTitle(promptToEdit.title);
      setSystemPrompt(promptToEdit.system_prompt);
      setCategory(promptToEdit.category || "");
    }
  }, [promptToEdit]);

  const createPromptMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("User not authenticated");

      const promptData = {
        title,
        system_prompt: systemPrompt,
        category,
        user_id: user.id,
      };

      if (promptToEdit) {
        const { error } = await supabase
          .from("ai_prompts")
          .update(promptData)
          .eq("id", promptToEdit.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("ai_prompts")
          .insert([promptData]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiPrompts"] });
      if (!promptToEdit) {
        setTitle("");
        setSystemPrompt("");
        setCategory("");
      }
      toast({
        title: "Success",
        description: `Prompt ${promptToEdit ? "updated" : "created"} successfully`,
      });
      if (promptToEdit && onCancelEdit) {
        onCancelEdit();
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save prompt",
        variant: "destructive",
      });
      console.error("Error saving prompt:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPromptMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{promptToEdit ? "Edit" : "Create New"} Prompt</CardTitle>
          <CardDescription>
            {promptToEdit ? "Update" : "Add a new"} AI prompt template for generating content
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
        <CardFooter className="flex gap-2">
          <Button
            type="submit"
            disabled={createPromptMutation.isPending}
            className="flex-1"
          >
            {createPromptMutation.isPending ? (
              promptToEdit ? "Updating..." : "Creating..."
            ) : (
              <>
                {promptToEdit ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                {promptToEdit ? "Update" : "Create"} Prompt
              </>
            )}
          </Button>
          {promptToEdit && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancelEdit}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
        </CardFooter>
      </Card>
    </form>
  );
};