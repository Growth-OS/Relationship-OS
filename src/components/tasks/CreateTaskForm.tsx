import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { TaskSource } from "./types";

const taskCategories: { label: string; value: TaskSource }[] = [
  { label: "Projects", value: "projects" },
  { label: "Deals", value: "deals" },
  { label: "Content", value: "content" },
  { label: "Ideas", value: "ideas" },
  { label: "Substack", value: "substack" },
  { label: "Other", value: "other" },
];

export interface CreateTaskFormProps {
  onSuccess?: () => void;
  source?: TaskSource;
  sourceId?: string;
  projectId?: string;
  defaultValues?: {
    title?: string;
    description?: string;
  };
}

export const CreateTaskForm = ({ onSuccess, source, sourceId, projectId, defaultValues }: CreateTaskFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      due_date: "",
      priority: "medium",
      source: source || "other",
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
          source: values.source,
          source_id: sourceId,
          user_id: user.id,
          due_date: values.due_date,
          priority: values.priority,
          project_id: projectId,
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

        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={!!source} // Disable if source is provided as prop
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {taskCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Button type="submit">Create Task</Button>
      </form>
    </Form>
  );
};