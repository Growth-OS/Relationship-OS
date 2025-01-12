import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, differenceInDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { ProjectPortal } from "./ProjectPortal";
import { Project } from "@/integrations/supabase/types/projects";
import { Checkbox } from "@/components/ui/checkbox";
import { useTaskOperations } from "@/components/tasks/hooks/useTaskOperations";
import { TaskData } from "@/components/tasks/types";

interface ProjectWithTasks extends Project {
  tasks: TaskData[];
}

export const ProjectsTimelines = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectWithTasks | null>(null);
  const { handleTaskComplete } = useTaskOperations();
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects-with-tasks"],
    queryFn: async () => {
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select(`
          *,
          tasks!project_id(
            id,
            title,
            due_date,
            completed,
            priority,
            created_at,
            user_id,
            description,
            source,
            source_id,
            project_id,
            deal_id,
            substack_post_id
          )
        `)
        .order("last_activity_date", { ascending: false });

      if (projectsError) throw projectsError;
      return projectsData as unknown as ProjectWithTasks[];
    },
  });

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

  return (
    <div className="space-y-6">
      {projects?.map((project) => {
        const tasksWithDates = project.tasks?.filter(task => task.due_date && !task.completed) || [];
        if (!tasksWithDates.length) return null;

        const sortedTasks = [...tasksWithDates].sort(
          (a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()
        );

        const earliestDate = new Date(sortedTasks[0].due_date!);
        const latestDate = new Date(sortedTasks[sortedTasks.length - 1].due_date!);
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
            <div className="relative bg-gray-50 rounded-lg p-6">
              {sortedTasks.map((task) => {
                const taskDate = new Date(task.due_date!);
                const offsetDays = differenceInDays(taskDate, earliestDate);
                const leftPercentage = (offsetDays / totalDays) * 100;

                return (
                  <div 
                    key={task.id} 
                    className="relative h-20 mb-4 last:mb-0"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="absolute inset-y-0 left-0 w-full">
                      <div
                        className="absolute h-full flex items-center"
                        style={{ left: `${leftPercentage}%` }}
                      >
                        <div className="w-4 h-4 bg-primary rounded-full absolute -left-2" />
                        <Card className="ml-6 p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer w-[calc(100%-2rem)]">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={task.completed || false}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTaskComplete(task.id, !task.completed, sortedTasks);
                              }}
                            />
                            <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                              {task.title}
                            </span>
                            <Badge className={getPriorityColor(task.priority || '')}>
                              {task.priority}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {format(taskDate, "MMM d, yyyy")}
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
