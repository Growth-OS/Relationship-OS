import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { usePromptForm } from "../hooks/usePromptForm";

interface GeneralPromptForm {
  title: string;
  prompt: string;
}

interface CreatePromptFormProps {
  onSuccess: () => void;
}

export const CreatePromptForm = ({ onSuccess }: CreatePromptFormProps) => {
  const form = useForm<GeneralPromptForm>();
  const { handleSubmit: handlePromptSubmit } = usePromptForm();

  const onSubmit = async (data: GeneralPromptForm) => {
    const promptData = {
      title: data.title,
      system_prompt: data.prompt,
      category: "general_prompt",
      user_id: "", // Will be set in handlePromptSubmit
    };

    await handlePromptSubmit(promptData);
    form.reset();
    onSuccess();
  };

  return (
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
  );
};