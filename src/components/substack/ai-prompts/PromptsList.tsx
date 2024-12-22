import { AIPrompt } from "@/components/ai-prompts/types";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PromptsListProps {
  prompts?: AIPrompt[];
  isLoading: boolean;
  onEditPrompt: (prompt: AIPrompt) => void;
}

export const PromptsList = ({ prompts, isLoading, onEditPrompt }: PromptsListProps) => {
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
    return <div>Loading prompts...</div>;
  }

  if (!prompts?.length) {
    return <div>No prompts found</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>System Prompt</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prompts.map((prompt) => (
            <TableRow key={prompt.id}>
              <TableCell className="font-medium">{prompt.title}</TableCell>
              <TableCell>{prompt.category || "-"}</TableCell>
              <TableCell className="max-w-[400px] truncate">
                {prompt.system_prompt}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditPrompt(prompt)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePromptMutation.mutate(prompt.id)}
                    disabled={deletePromptMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};