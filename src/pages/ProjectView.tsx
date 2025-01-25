import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectDetails } from "@/components/projects/portal/ProjectDetails";
import { ProjectCredentials } from "@/components/projects/portal/ProjectCredentials";
import { ProjectFiles } from "@/components/projects/portal/ProjectFiles";
import { ProjectNotes } from "@/components/projects/portal/ProjectNotes";
import { ProjectTasks } from "@/components/projects/portal/ProjectTasks";
import { ArrowLeft, Table, LayoutDashboard, CalendarRange, Users, Plus, Filter, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

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
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="container mx-auto p-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/projects")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{project.name}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{project.client_name}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Progress value={progress} className="w-20 h-2" />
                <span>{Math.round(progress)}% Complete</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <Avatar className="border-2 border-white">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-white">
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <Avatar className="border-2 border-white">
              <AvatarFallback>YZ</AvatarFallback>
            </Avatar>
            <Button size="sm" variant="outline" className="ml-2">
              <Plus className="w-4 h-4 mr-1" /> Add Member
            </Button>
          </div>
        </div>
      </div>

      {/* View Controls */}
      <div className="flex items-center justify-between mb-6 bg-gray-50/50 p-2 rounded-lg">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Table className="w-4 h-4 mr-2" />
            Table
          </Button>
          <Button variant="ghost" size="sm">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Board
          </Button>
          <Button variant="ghost" size="sm">
            <CalendarRange className="w-4 h-4 mr-2" />
            Timeline
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Sort
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tasks" className="flex-1">
        <TabsList className="w-full justify-start gap-2 h-auto p-1 bg-gray-100/50 rounded-lg mb-6">
          {[
            { value: "tasks", label: "Tasks" },
            { value: "details", label: "Details" },
            { value: "credentials", label: "Credentials" },
            { value: "files", label: "Files" },
            { value: "notes", label: "Notes" }
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

        <div className="bg-white rounded-lg border">
          <TabsContent value="tasks" className="m-0">
            <ProjectTasks projectId={project.id} />
          </TabsContent>
          <TabsContent value="details" className="m-0">
            <ProjectDetails project={project} onClose={() => navigate("/dashboard/projects")} />
          </TabsContent>
          <TabsContent value="credentials" className="m-0">
            <ProjectCredentials projectId={project.id} />
          </TabsContent>
          <TabsContent value="files" className="m-0">
            <ProjectFiles projectId={project.id} />
          </TabsContent>
          <TabsContent value="notes" className="m-0">
            <ProjectNotes projectId={project.id} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ProjectView;