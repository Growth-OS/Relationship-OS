import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Sparkles, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { usePromptForm } from "./hooks/usePromptForm";
import { usePromptQuery } from "./hooks/usePromptQuery";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

interface GeneralPromptForm {
  title: string;
  prompt: string;
}

export const GeneralPromptsSection = () => {
  const form = useForm<GeneralPromptForm>();
  const { handleSubmit: handlePromptSubmit } = usePromptForm();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to fetch all general prompts
  const { data: prompts } = useQuery({
    queryKey: ["aiPrompts", "general_prompt"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_prompts")
        .select("*")
        .eq("category", "general_prompt")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
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

  const onSubmit = async (data: GeneralPromptForm) => {
    const promptData = {
      title: data.title,
      system_prompt: data.prompt,
      category: "general_prompt",
      user_id: "", // Will be set in handlePromptSubmit
    };

    await handlePromptSubmit(promptData);
    form.reset(); // Clear the form after successful submission
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter prompt name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your prompt here..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">
              Create Prompt
            </Button>
          </form>
        </Form>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Prompt</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prompts?.map((prompt) => (
                <TableRow key={prompt.id}>
                  <TableCell className="font-medium">{prompt.title}</TableCell>
                  <TableCell className="max-w-[400px] truncate">
                    {prompt.system_prompt}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deletePromptMutation.mutate(prompt.id)}
                      disabled={deletePromptMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};