import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ProjectFormFields } from "./form/ProjectFormFields";
import { ProjectDateFields } from "./form/ProjectDateFields";
import { ProjectBudgetField } from "./form/ProjectBudgetField";
import { ProjectFormData } from "./form/types";

interface CreateProjectFormProps {
  onSuccess?: () => void;
}

export const CreateProjectForm = ({ onSuccess }: CreateProjectFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<ProjectFormData>({
    defaultValues: {
      status: 'active',
    }
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to create a project');
        return;
      }

      const { error } = await supabase
        .from('projects')
        .insert({
          ...data,
          user_id: user.id,
          start_date: data.start_date?.toISOString().split('T')[0],
          end_date: data.end_date?.toISOString().split('T')[0],
        });

      if (error) throw error;
      
      toast.success('Project created successfully');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onSuccess?.();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Error creating project');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ProjectFormFields form={form} />
        <ProjectDateFields form={form} />
        <ProjectBudgetField form={form} />
        <Button type="submit" className="w-full">
          Create Project
        </Button>
      </form>
    </Form>
  );
};