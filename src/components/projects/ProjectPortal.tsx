import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCredentials } from "./portal/ProjectCredentials";
import { ProjectTasks } from "./portal/ProjectTasks";
import { ProjectFiles } from "./portal/ProjectFiles";
import { ProjectDetails } from "./portal/ProjectDetails";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, DollarSign } from "lucide-react";
import { format } from "date-fns";

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "completed":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "on_hold":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export const ProjectPortal = ({ project, isOpen, onClose }: ProjectPortalProps) => {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-semibold">{project.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">{project.client_name}</p>
            </div>
            <Badge className={`${getStatusColor(project.status)} border capitalize`}>
              {project.status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
            {project.budget && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">${project.budget.toLocaleString()}</span>
              </div>
            )}
            {(project.start_date || project.end_date) && (
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>
                  {project.start_date && format(new Date(project.start_date), "MMM d, yyyy")}
                  {project.end_date && ` - ${format(new Date(project.end_date), "MMM d, yyyy")}`}
                </span>
              </div>
            )}
          </div>
          
          {project.description && (
            <p className="text-sm text-muted-foreground border-t pt-4">
              {project.description}
            </p>
          )}
        </DialogHeader>

        <Tabs defaultValue="details" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>
          <div className="flex-1 overflow-y-auto mt-4 pr-2">
            <TabsContent value="details" className="mt-0 h-full">
              <ProjectDetails project={project} onClose={onClose} />
            </TabsContent>
            <TabsContent value="credentials" className="mt-0 h-full">
              <ProjectCredentials projectId={project.id} />
            </TabsContent>
            <TabsContent value="tasks" className="mt-0 h-full">
              <ProjectTasks projectId={project.id} />
            </TabsContent>
            <TabsContent value="files" className="mt-0 h-full">
              <ProjectFiles projectId={project.id} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};