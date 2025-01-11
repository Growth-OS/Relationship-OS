import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, differenceInDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { ProjectPortal } from "./ProjectPortal";
import { Project as SupabaseProject } from "@/integrations/supabase/types/projects";

interface Task {
  id: string;
  title: string;
  due_date: string;
  completed: boolean;
  priority: string;
}

interface Project extends SupabaseProject {
  tasks: Task[];
}

export const ProjectsTimelines = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects-with-tasks"],
    queryFn: async () => {
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select(`
          id,
          name,
          client_name,
          status,
          description,
          budget,
          start_date,
          end_date,
          last_activity_date,
          tasks!project_id(
            id,
            title,
            due_date,
            completed,
            priority
          )
        `)
        .order("last_activity_date", { ascending: false });

      if (projectsError) throw projectsError;
      return projectsData as Project[];
    },
    // Refresh data every 30 seconds to catch new tasks
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!projects?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No projects found</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "on_hold":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {projects?.map((project) => {
        if (!project.tasks?.length) return null;

        const sortedTasks = [...project.tasks].sort(
          (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        );

        const earliestDate = new Date(sortedTasks[0].due_date);
        const latestDate = new Date(sortedTasks[sortedTasks.length - 1].due_date);
        const totalDays = differenceInDays(latestDate, earliestDate) + 1;

        return (
          <Card key={project.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-sm text-gray-600">{project.client_name}</p>
              </div>
              <Badge className={getStatusColor(project.status || '')}>
                {project.status}
              </Badge>
            </div>

            <div className="space-y-4">
              {sortedTasks.map((task) => {
                const taskDate = new Date(task.due_date);
                const offsetDays = differenceInDays(taskDate, earliestDate);
                const leftPercentage = (offsetDays / totalDays) * 100;

                return (
                  <div 
                    key={task.id} 
                    className="relative h-16 cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="absolute inset-y-0 left-0 w-full bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                      <div
                        className="absolute h-full"
                        style={{
                          left: `${leftPercentage}%`,
                          width: "8px",
                          backgroundColor: task.completed ? "#10B981" : "#6B7280",
                        }}
                      >
                        <Card className="absolute top-0 left-2 m-2 p-2 bg-white whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{task.title}</span>
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {format(new Date(task.due_date), "MMM d, yyyy")}
                            </span>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-sm text-gray-500 mt-4">
              <span>{format(earliestDate, "MMM d, yyyy")}</span>
              <span>{format(latestDate, "MMM d, yyyy")}</span>
            </div>
          </Card>
        );
      })}

      <ProjectPortal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
};