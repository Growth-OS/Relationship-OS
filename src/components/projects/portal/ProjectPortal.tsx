import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectDetails } from "./ProjectDetails";
import { ProjectCredentials } from "./ProjectCredentials";
import { ProjectFiles } from "./ProjectFiles";
import { ProjectNotes } from "./ProjectNotes";
import { ProjectTasks } from "./ProjectTasks";
import { ProjectTimeline } from "./ProjectTimeline";
import { cn } from "@/lib/utils";

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
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] w-full lg:max-w-7xl h-[90vh] flex flex-col p-0 gap-0 bg-white/80 backdrop-blur-sm border border-gray-100">
        <Tabs defaultValue="timeline" className="flex-1 overflow-hidden">
          <div className="p-8 pb-0 border-b border-gray-100 bg-gradient-to-br from-white to-gray-50/50">
            <h2 className="text-3xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              {project.name}
            </h2>
            <p className="text-gray-600 mb-6 text-lg">{project.client_name}</p>
            
            <TabsList className="w-full justify-start gap-2 h-auto p-0 bg-transparent">
              {[
                { value: "timeline", label: "Timeline" },
                { value: "details", label: "Details" },
                { value: "credentials", label: "Credentials" },
                { value: "files", label: "Files" },
                { value: "notes", label: "Notes" },
                { value: "tasks", label: "Tasks" }
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "px-6 py-3 rounded-full text-sm font-medium transition-all",
                    "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                    "data-[state=inactive]:bg-gray-100/50 data-[state=inactive]:text-gray-600",
                    "hover:bg-gray-100"
                  )}
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <TabsContent value="timeline" className="mt-0 h-full">
              <ProjectTimeline projectId={project.id} />
            </TabsContent>
            <TabsContent value="details" className="mt-0 h-full">
              <ProjectDetails project={project} onClose={onClose} />
            </TabsContent>
            <TabsContent value="credentials" className="mt-0 h-full">
              <ProjectCredentials projectId={project.id} />
            </TabsContent>
            <TabsContent value="files" className="mt-0 h-full">
              <ProjectFiles projectId={project.id} />
            </TabsContent>
            <TabsContent value="notes" className="mt-0 h-full">
              <ProjectNotes projectId={project.id} />
            </TabsContent>
            <TabsContent value="tasks" className="mt-0 h-full">
              <ProjectTasks projectId={project.id} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};