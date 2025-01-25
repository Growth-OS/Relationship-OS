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
import { ProjectStats } from "@/components/projects/ProjectStats";
import { ArrowLeft, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

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

      if (error) throw error;
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
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/projects")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-gray-100">
              <Briefcase className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{project.name}</h1>
              <p className="text-sm text-gray-600">{project.client_name}</p>
            </div>
          </div>
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

      <Tabs defaultValue="details" className="flex-1">
        <TabsList className="w-full justify-start gap-2 h-auto p-1 bg-gray-100/50 rounded-lg">
          {[
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
                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                "data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm",
                "data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600",
                "hover:text-primary"
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
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
  );
};

export default ProjectView;