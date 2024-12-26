import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCredentials } from "./portal/ProjectCredentials";
import { ProjectTasks } from "./portal/ProjectTasks";
import { ProjectFiles } from "./portal/ProjectFiles";
import { ProjectDetails } from "./portal/ProjectDetails";

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

interface ProjectPortalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectPortal = ({ project, isOpen, onClose }: ProjectPortalProps) => {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{project.name} - {project.client_name}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="details" className="h-full">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>
          <div className="mt-4 h-[calc(100%-4rem)] overflow-y-auto">
            <TabsContent value="details">
              <ProjectDetails project={project} onClose={onClose} />
            </TabsContent>
            <TabsContent value="credentials">
              <ProjectCredentials projectId={project.id} />
            </TabsContent>
            <TabsContent value="tasks">
              <ProjectTasks projectId={project.id} />
            </TabsContent>
            <TabsContent value="files">
              <ProjectFiles projectId={project.id} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};