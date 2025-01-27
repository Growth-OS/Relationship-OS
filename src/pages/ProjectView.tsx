import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectDetails } from "@/components/projects/portal/ProjectDetails";
import { ProjectCredentials } from "@/components/projects/portal/ProjectCredentials";
import { ProjectFiles } from "@/components/projects/portal/ProjectFiles";
import { ProjectNotes } from "@/components/projects/portal/ProjectNotes";
import { ProjectTasks } from "@/components/projects/portal/ProjectTasks";
import { ProjectTimeline } from "@/components/projects/portal/ProjectTimeline";
import { ProjectAllTasks } from "@/components/projects/portal/ProjectAllTasks";
import { ProjectStats } from "@/components/projects/ProjectStats";
import { ArrowLeft, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ProjectView = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          tasks (
            id,
            title,
            completed
          ),
          project_documents (
            id
          )
        `)
        .eq("id", projectId)
        .single();

      if (error) {
        toast.error("Failed to load project");
        throw error;
      }
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 w-1/4 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-1/3 bg-gray-200 rounded mb-8" />
          <div className="h-[400px] bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/dashboard/projects")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter(task => task.completed)?.length || 0;
  const totalDocuments = project.project_documents?.length || 0;

  return (
    <div className="container mx-auto space-y-6 max-w-7xl">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard/projects")}
              className="text-gray-300 hover:text-white hover:bg-gray-800/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-8 bg-gray-700" />
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-gray-800/50 backdrop-blur-sm">
                <Briefcase className="w-5 h-5 text-gray-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <p className="text-gray-300 text-lg">{project.client_name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-300">
            <span>Project Timeline</span>
            <Separator orientation="vertical" className="h-4 bg-gray-700" />
            <span className="font-medium text-white">
              {new Date(project.start_date).toLocaleDateString('en-GB')} - {new Date(project.end_date).toLocaleDateString('en-GB')}
            </span>
          </div>
        </div>

        <ProjectStats 
          project={{
            ...project,
            totalTasks,
            completedTasks,
            totalDocuments
          }} 
        />
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
        <Tabs defaultValue="timeline" className="flex-1">
          <TabsList className="w-full justify-start gap-2 h-auto p-1 bg-gray-100/50 rounded-lg mb-6">
            {[
              { value: "timeline", label: "Timeline" },
              { value: "all-tasks", label: "All Tasks" },
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
                  "px-4 py-2.5 rounded-full text-sm font-medium transition-all",
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  "data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600",
                  "hover:bg-gray-100"
                )}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6">
            <TabsContent value="timeline">
              <ProjectTimeline projectId={project.id} />
            </TabsContent>
            <TabsContent value="all-tasks">
              <ProjectAllTasks projectId={project.id} />
            </TabsContent>
            <TabsContent value="details">
              <ProjectDetails project={project} onClose={() => navigate("/dashboard/projects")} />
            </TabsContent>
            <TabsContent value="credentials">
              <ProjectCredentials projectId={project.id} />
            </TabsContent>
            <TabsContent value="files">
              <ProjectFiles projectId={project.id} />
            </TabsContent>
            <TabsContent value="notes">
              <ProjectNotes projectId={project.id} />
            </TabsContent>
            <TabsContent value="tasks">
              <ProjectTasks projectId={project.id} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectView;