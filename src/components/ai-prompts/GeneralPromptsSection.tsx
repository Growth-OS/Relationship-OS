import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Sparkles } from "lucide-react";
import { useEffect } from "react";
import { usePromptForm } from "./hooks/usePromptForm";
import { usePromptQuery } from "./hooks/usePromptQuery";

interface GeneralPromptForm {
  title: string;
  prompt: string;
}

export const GeneralPromptsSection = () => {
  const form = useForm<GeneralPromptForm>();
  const { handleSubmit: handlePromptSubmit } = usePromptForm();
  const { data: existingPrompt } = usePromptQuery("general_prompt");

  useEffect(() => {
    if (existingPrompt) {
      form.reset({
        title: existingPrompt.title,
        prompt: existingPrompt.system_prompt,
      });
    }
  }, [existingPrompt, form]);

  const onSubmit = async (data: GeneralPromptForm) => {
    const promptData = {
      title: data.title,
      system_prompt: data.prompt,
      category: "general_prompt",
      user_id: "", // Will be set in handlePromptSubmit
    };

    await handlePromptSubmit(promptData, existingPrompt?.id);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <CardTitle>AI Prompts</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
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
              {existingPrompt ? 'Update' : 'Create'} Prompt
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};