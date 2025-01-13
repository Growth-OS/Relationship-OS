import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { TaskSource } from "@/integrations/supabase/types/tasks";

interface CreateTaskFormProps {
  onSuccess?: () => void;
  defaultValues?: {
    title?: string;
    description?: string;
    source?: TaskSource;
    source_id?: string;
    project_id?: string;
  };
}

export const CreateTaskForm = ({ onSuccess, defaultValues }: CreateTaskFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      source: defaultValues?.source || "other",
      source_id: defaultValues?.source_id || "",
      project_id: defaultValues?.project_id || "",
      due_date: "",
      priority: "medium",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('tasks')
        .insert({
          title: values.title,
          description: values.description,
          source: values.source as TaskSource,
          source_id: values.source_id,
          user_id: user.id,
          due_date: values.due_date,
          priority: values.priority,
          project_id: values.project_id,
        });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task created successfully');
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">Create Task</Button>
      </form>
    </Form>
  );
};