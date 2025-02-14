import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Calendar, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  completed: boolean;
  priority?: string;
}

interface ProjectTimelineProps {
  projectId: string;
}

export const ProjectTimeline = ({ projectId }: ProjectTimelineProps) => {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["project-tasks", projectId],
    queryFn: async () => {
      console.log("ProjectTimeline: Fetching tasks for project:", projectId);
      
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("source", "projects")
        .eq("source_id", projectId)
        .order('due_date', { ascending: true });

      if (error) {
        console.error("ProjectTimeline: Error fetching tasks:", error);
        throw error;
      }

      console.log("ProjectTimeline: Found", data?.length || 0, "tasks");
      console.log("ProjectTimeline: Tasks data:", data);
      
      return data as Task[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="w-full max-w-6xl animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-md w-64" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const groupedTasks = tasks.reduce((acc, task) => {
    const date = task.due_date ? format(new Date(task.due_date), "yyyy-MM-dd") : "No Date";
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const sortedDates = Object.keys(groupedTasks).sort((a, b) => {
    if (a === "No Date") return 1;
    if (b === "No Date") return -1;
    return new Date(a).getTime() - new Date(b).getTime();
  });

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-full bg-primary/10">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Project Timeline</h3>
      </div>

      <div className="space-y-8">
        {sortedDates.map((date) => (
          <div key={date} className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium min-w-[120px] text-center",
                  date === format(new Date(), "yyyy-MM-dd")
                    ? "bg-primary/10 text-primary"
                    : "bg-gray-50/50 text-gray-700"
                )}
              >
                {date === "No Date" ? (
                  "No Due Date"
                ) : (
                  format(new Date(date), "EEE d MMM")
                )}
              </div>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            <div className="grid gap-4">
              {groupedTasks[date].map((task) => (
                <Card
                  key={task.id}
                  className={cn(
                    "p-4 transition-all hover:shadow-md",
                    task.priority === "high"
                      ? "bg-red-50 border-red-100"
                      : "bg-blue-50 border-blue-100"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {task.priority === "high" && (
                      <Flag className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="font-medium text-gray-900 text-left">
                          {task.title}
                        </h4>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "flex-shrink-0",
                            task.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          )}
                        >
                          {task.priority || "Normal"}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1 text-left">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {sortedDates.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No tasks found for this project
          </div>
        )}
      </div>
    </div>
  );
};