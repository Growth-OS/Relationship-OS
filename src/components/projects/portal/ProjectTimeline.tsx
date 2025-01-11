import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays, differenceInDays } from "date-fns";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
  priority: string;
}

export const ProjectTimeline = ({ projectId }: { projectId: string }) => {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["project-tasks-timeline", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId)
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data as Task[];
    },
  });

  if (isLoading) {
    return <div>Loading timeline...</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tasks found for this project</p>
      </div>
    );
  }

  const tasksWithDates = tasks.filter((task) => task.due_date);
  
  if (tasksWithDates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No tasks with due dates found</p>
      </div>
    );
  }

  const earliestDate = new Date(Math.min(...tasksWithDates.map((t) => new Date(t.due_date).getTime())));
  const latestDate = new Date(Math.max(...tasksWithDates.map((t) => new Date(t.due_date).getTime())));
  const totalDays = differenceInDays(latestDate, earliestDate) + 1;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative space-y-4">
        {tasksWithDates.map((task) => {
          const taskDate = new Date(task.due_date);
          const offsetDays = differenceInDays(taskDate, earliestDate);
          const leftPercentage = (offsetDays / totalDays) * 100;

          return (
            <div key={task.id} className="relative h-20">
              <div className="absolute inset-y-0 left-0 w-full bg-gray-50 dark:bg-gray-800 rounded">
                <div
                  className="absolute h-full"
                  style={{
                    left: `${leftPercentage}%`,
                    width: "4px",
                    backgroundColor: task.completed ? "#22c55e" : "#94a3b8"
                  }}
                >
                  <Card className={`absolute top-0 left-2 m-2 p-3 w-80 ${task.completed ? "opacity-50" : ""}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground truncate">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between text-sm text-muted-foreground mt-2">
        <span>{format(earliestDate, "MMM d, yyyy")}</span>
        <span>{format(latestDate, "MMM d, yyyy")}</span>
      </div>
    </div>
  );
};