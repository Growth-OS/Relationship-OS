import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProjectDateFields } from "../form/ProjectDateFields";
import { ProjectBudgetField } from "../form/ProjectBudgetField";
import { ProjectFormData } from "../form/types";
import { CalendarDays, Building2, BadgeDollarSign, Activity } from "lucide-react";

interface Project {
  id: string;
  name: string;
  client_name: string;
  description?: string;
  status: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
}

interface ProjectDetailsProps {
  project: Project;
  onClose: () => void;
}

export const ProjectDetails = ({ project, onClose }: ProjectDetailsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<ProjectFormData>({
    defaultValues: {
      name: project.name,
      client_name: project.client_name,
      description: project.description,
      status: project.status as 'active' | 'completed' | 'on_hold',
      budget: project.budget,
      start_date: project.start_date ? new Date(project.start_date) : undefined,
      end_date: project.end_date ? new Date(project.end_date) : undefined,
    },
  });

  const handleUpdate = async (data: ProjectFormData) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          ...data,
          start_date: data.start_date?.toISOString().split("T")[0],
          end_date: data.end_date?.toISOString().split("T")[0],
        })
        .eq("id", project.id);

      if (error) throw error;

      toast.success("Project updated successfully");
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id);

      if (error) throw error;

      toast.success("Project deleted successfully");
      onClose();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit Project
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Project</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  project and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-8 max-w-4xl mx-auto">
        <div className="grid gap-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Status</h3>
            </div>
            <div className="p-4 bg-gray-50/50 rounded-lg border border-gray-100">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on_hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Timeline</h3>
            </div>
            <div className="p-4 bg-gray-50/50 rounded-lg border border-gray-100">
              <ProjectDateFields form={form} />
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <BadgeDollarSign className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Budget</h3>
            </div>
            <div className="p-4 bg-gray-50/50 rounded-lg border border-gray-100">
              <ProjectBudgetField form={form} />
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};