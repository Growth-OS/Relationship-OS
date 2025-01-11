import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, startOfQuarter, endOfQuarter, eachMonthOfInterval, isWithinInterval, addQuarters } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ProjectPortal } from "./ProjectPortal";

interface Task {
  id: string;
  title: string;
  due_date: string;
  description: string | null;
  project_id: string;
}

interface Project {
  id: string;
  name: string;
  client_name: string;
  status: string;
  budget: number;
  start_date: string;
  end_date: string;
  last_activity_date: string;
  tasks: Task[];
}

export const QuarterlyTimeline = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const quarterStart = startOfQuarter(currentDate);
  const quarterEnd = endOfQuarter(currentDate);
  const months = eachMonthOfInterval({ start: quarterStart, end: quarterEnd });

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects-with-tasks", quarterStart, quarterEnd],
    queryFn: async () => {
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("id, name, client_name, status, budget, start_date, end_date, last_activity_date")
        .order("name");

      if (projectsError) throw projectsError;

      const projectsWithTasks = await Promise.all(
        projectsData.map(async (project) => {
          const { data: tasksData, error: tasksError } = await supabase
            .from("tasks")
            .select("*")
            .eq("project_id", project.id)
            .eq("completed", false)  // Only fetch non-completed tasks
            .gte("due_date", quarterStart.toISOString())
            .lte("due_date", quarterEnd.toISOString())
            .order("due_date");

          if (tasksError) throw tasksError;

          return {
            ...project,
            tasks: tasksData,
          };
        })
      );

      // Filter out projects with no active tasks
      return projectsWithTasks.filter(project => project.tasks.length > 0);
    },
  });

  const handlePreviousQuarter = () => {
    setCurrentDate(addQuarters(currentDate, -1));
  };

  const handleNextQuarter = () => {
    setCurrentDate(addQuarters(currentDate, 1));
  };

  const getTaskPosition = (dueDate: string) => {
    const date = new Date(dueDate);
    const totalDays = Math.floor((quarterEnd.getTime() - quarterStart.getTime()) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.floor((date.getTime() - quarterStart.getTime()) / (1000 * 60 * 60 * 24));
    return (daysPassed / totalDays) * 100;
  };

  const getRandomColor = (index: number) => {
    const colors = [
      "bg-blue-200 border-blue-400",
      "bg-green-200 border-green-400",
      "bg-purple-200 border-purple-400",
      "bg-yellow-200 border-yellow-400",
      "bg-pink-200 border-pink-400",
    ];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handlePreviousQuarter}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            Q{Math.floor(currentDate.getMonth() / 3) + 1} {currentDate.getFullYear()}
          </h2>
          <Button variant="outline" size="icon" onClick={handleNextQuarter}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        {/* Month headers */}
        <div className="grid grid-cols-3 mb-4 border-b">
          {months.map((month) => (
            <div key={month.toString()} className="text-center py-2 font-medium">
              {format(month, "MMMM yyyy")}
            </div>
          ))}
        </div>

        {/* Projects and tasks */}
        <div className="space-y-6">
          {projects.map((project, projectIndex) => (
            <div key={project.id} className="relative">
              <div className="font-medium mb-2">{project.name}</div>
              <div className="h-12 bg-gray-50 relative rounded">
                {project.tasks.map((task) => (
                  <TooltipProvider key={task.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`absolute h-8 top-2 rounded border-2 ${getRandomColor(
                            projectIndex
                          )} hover:opacity-80 transition-opacity cursor-pointer`}
                          style={{
                            left: `${getTaskPosition(task.due_date)}%`,
                            width: "120px",
                            transform: "translateX(-60px)",
                          }}
                          onClick={() => setSelectedProject(project)}
                        >
                          <div className="truncate px-2 text-sm">{task.title}</div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-gray-500">
                            Due: {format(new Date(task.due_date), "dd MMM yyyy")}
                          </div>
                          {task.description && (
                            <div className="text-sm mt-1">{task.description}</div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProjectPortal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </Card>
  );
};