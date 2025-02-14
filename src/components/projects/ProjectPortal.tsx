import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectDetails } from "./portal/ProjectDetails";
import { ProjectCredentials } from "./portal/ProjectCredentials";
import { ProjectFiles } from "./portal/ProjectFiles";
import { ProjectNotes } from "./portal/ProjectNotes";
import { ProjectTasks } from "./portal/ProjectTasks";
import { ProjectTimeline } from "./portal/ProjectTimeline";
import { ProjectAllTasks } from "./portal/ProjectAllTasks";
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
        <Tabs defaultValue="all-tasks" className="flex-1 overflow-hidden">
          <div className="p-8 pb-4 border-b border-gray-100 bg-gradient-to-br from-white to-gray-50/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                  {project.name}
                </h2>
                <p className="text-gray-600 text-lg">{project.client_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Project Timeline</span>
                <div className="h-6 w-px bg-gray-200" />
                <span className="text-sm font-medium text-gray-900">
                  {new Date(project.start_date).toLocaleDateString('en-GB')} - {new Date(project.end_date).toLocaleDateString('en-GB')}
                </span>
              </div>
            </div>
            
            <TabsList className="w-full justify-start gap-2 h-auto p-0 bg-transparent">
              {[
                { value: "all-tasks", label: "All Tasks" },
                { value: "timeline", label: "Timeline" },
                { value: "details", label: "Details" },
                { value: "credentials", label: "Credentials" },
                { value: "files", label: "Files" },
                { value: "notes", label: "Notes" },
                { value: "tasks", label: "Add Tasks" }
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

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="all-tasks" className="mt-0 h-full p-8">
              <ProjectAllTasks projectId={project.id} />
            </TabsContent>
            <TabsContent value="timeline" className="mt-0 h-full">
              <ProjectTimeline projectId={project.id} />
            </TabsContent>
            <TabsContent value="details" className="mt-0 h-full p-8">
              <ProjectDetails project={project} onClose={onClose} />
            </TabsContent>
            <TabsContent value="credentials" className="mt-0 h-full p-8">
              <ProjectCredentials projectId={project.id} />
            </TabsContent>
            <TabsContent value="files" className="mt-0 h-full p-8">
              <ProjectFiles projectId={project.id} />
            </TabsContent>
            <TabsContent value="notes" className="mt-0 h-full p-8">
              <ProjectNotes projectId={project.id} />
            </TabsContent>
            <TabsContent value="tasks" className="mt-0 h-full p-8">
              <ProjectTasks projectId={project.id} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};