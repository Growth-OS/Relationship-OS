import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectDetails } from "./portal/ProjectDetails";
import { ProjectTasks } from "./portal/ProjectTasks";
import { ProjectCredentials } from "./portal/ProjectCredentials";
import { ProjectFiles } from "./portal/ProjectFiles";
import { ProjectNotes } from "./portal/ProjectNotes";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  name: string;
  client_name: string;
  status: string;
  budget: number;
  start_date: string;
  end_date: string;
  last_activity_date: string;
}

interface ProjectPortalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectPortal = ({ project, isOpen, onClose }: ProjectPortalProps) => {
  // Fetch full project details including tasks when portal opens
  const { data: projectDetails } = useQuery({
    queryKey: ["project", project?.id],
    queryFn: async () => {
      if (!project?.id) return null;
      
      const { data: projectData, error } = await supabase
        .from("projects")
        .select(`
          *,
          tasks!project_id(
            id,
            title,
            description,
            due_date,
            completed,
            priority
          )
        `)
        .eq("id", project.id)
        .single();

      if (error) throw error;
      return projectData;
    },
    enabled: !!project?.id,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {project && (
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <div className="mt-4">
              <TabsContent value="details">
                <ProjectDetails project={projectDetails || project} />
              </TabsContent>
              <TabsContent value="tasks">
                <ProjectTasks project={projectDetails || project} />
              </TabsContent>
              <TabsContent value="credentials">
                <ProjectCredentials project={project} />
              </TabsContent>
              <TabsContent value="files">
                <ProjectFiles project={project} />
              </TabsContent>
              <TabsContent value="notes">
                <ProjectNotes project={project} />
              </TabsContent>
            </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};