import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCredentials } from "./portal/ProjectCredentials";
import { ProjectTasks } from "./portal/ProjectTasks";
import { ProjectFiles } from "./portal/ProjectFiles";
import { ProjectDetails } from "./portal/ProjectDetails";
import { ProjectNotes } from "./portal/ProjectNotes";
import { ProjectTimeline } from "./portal/ProjectTimeline";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, DollarSign, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ProjectPortal = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
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

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/dashboard/projects")}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold">{project.name}</h1>
                <p className="text-muted-foreground">{project.client_name}</p>
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
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <ProjectDetails project={project} onClose={() => navigate("/dashboard/projects")} />
          </TabsContent>
          <TabsContent value="timeline">
            <ProjectTimeline projectId={project.id} />
          </TabsContent>
          <TabsContent value="notes">
            <ProjectNotes projectId={project.id} />
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
        </Tabs>
      </div>
    </div>
  );
};