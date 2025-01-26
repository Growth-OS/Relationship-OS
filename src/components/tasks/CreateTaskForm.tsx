import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TaskFormFields } from "./form/TaskFormFields";
import { TaskFormProps } from "./types";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  due_date: z.string().min(1, "Due date is required"),
  priority: z.string(),
  source: z.string().optional(),
  source_id: z.string().optional(),
});

export const CreateTaskForm = ({ onSuccess, defaultValues, source, sourceId }: TaskFormProps) => {
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      due_date: "",
      priority: "medium",
      source: source || "other",
      source_id: sourceId,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("tasks")
        .insert([
          {
            ...values,
            user_id: user.id,
          },
        ]);

      if (error) throw error;

      toast.success("Task created successfully");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onSuccess?.();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TaskFormFields form={form} />
        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Create Task
          </Button>
        </div>
      </form>
    </Form>
  );
};