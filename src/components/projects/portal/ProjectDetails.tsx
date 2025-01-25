import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ProjectFormFields } from "../form/ProjectFormFields";
import { ProjectDateFields } from "../form/ProjectDateFields";
import { ProjectBudgetField } from "../form/ProjectBudgetField";
import { ProjectFormData } from "../form/types";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Building2, Briefcase, BadgeDollarSign } from "lucide-react";

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

        <div className="grid gap-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Project Information</h3>
            </div>
            <div className="grid gap-4 p-4 bg-gray-50/50 rounded-lg border border-gray-100">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Project Name</h4>
                <p className="text-lg">{project.name}</p>
              </div>
              {project.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-gray-100">
                  {project.status}
                </span>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Client Information</h3>
            </div>
            <div className="p-4 bg-gray-50/50 rounded-lg border border-gray-100">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Client Name</h4>
                <p className="text-lg">{project.client_name}</p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Timeline</h3>
            </div>
            <div className="p-4 bg-gray-50/50 rounded-lg border border-gray-100">
              {(project.start_date || project.end_date) && (
                <div className="grid gap-4">
                  {project.start_date && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Start Date</h4>
                      <p>{new Date(project.start_date).toLocaleDateString()}</p>
                    </div>
                  )}
                  {project.end_date && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">End Date</h4>
                      <p>{new Date(project.end_date).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              )}
              {!project.start_date && !project.end_date && (
                <p className="text-gray-500 italic">No timeline set</p>
              )}
            </div>
          </section>

          {project.budget && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <BadgeDollarSign className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold">Budget</h3>
              </div>
              <div className="p-4 bg-gray-50/50 rounded-lg border border-gray-100">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Project Budget</h4>
                  <p className="text-lg">${project.budget.toLocaleString()}</p>
                </div>
              </div>
            </section>
          )}
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
              <Briefcase className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Project Information</h3>
            </div>
            <div className="p-4 bg-gray-50/50 rounded-lg border border-gray-100">
              <ProjectFormFields form={form} />
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