import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isWeekend } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, CheckCircle, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [currentDate, setCurrentDate] = useState(new Date());
  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(addDays(currentDate, 21)); // Show 4 weeks

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["project-tasks", projectId, startDate, endDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId)
        .gte("due_date", startDate.toISOString())
        .lte("due_date", endDate.toISOString())
        .order("due_date");

      if (error) throw error;
      return data as Task[];
    },
  });

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const handlePreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const getTasksForDay = (date: Date) => {
    return tasks.filter(
      (task) => format(new Date(task.due_date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="w-full max-w-6xl animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-md w-64" />
          <div className="grid grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-6 bg-gray-100 rounded-md w-24" />
                <div className="h-32 bg-gray-50 rounded-lg border border-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Project Timeline</h3>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousWeek}
            className="h-9 px-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <div className="px-4 py-2 rounded-md bg-primary/5 text-sm font-medium text-primary">
            {format(startDate, "d MMM")} - {format(endDate, "d MMM yyyy")}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextWeek}
            className="h-9 px-4"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="mb-8">
              <div className="grid grid-cols-7 gap-4 mb-3">
                {week.map((day) => (
                  <div
                    key={day.toString()}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium",
                      isWeekend(day) ? "text-gray-400 bg-gray-50" : "text-gray-700 bg-gray-50/50",
                      isToday(day) && "bg-primary/10 text-primary"
                    )}
                  >
                    {format(day, "EEE d MMM")}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-4">
                {week.map((day) => (
                  <div
                    key={day.toString()}
                    className={cn(
                      "min-h-[150px] rounded-lg p-3 transition-colors",
                      isWeekend(day) ? "bg-gray-50/50" : "bg-white",
                      isToday(day) && "ring-2 ring-primary ring-offset-2",
                      "border border-gray-100 hover:border-gray-200"
                    )}
                  >
                    {getTasksForDay(day).map((task) => (
                      <Card
                        key={task.id}
                        className={cn(
                          "p-3 mb-2 group hover:shadow-md transition-all cursor-pointer",
                          task.completed
                            ? "bg-green-50 border-green-100 hover:bg-green-100"
                            : task.priority === "high"
                            ? "bg-red-50 border-red-100 hover:bg-red-100"
                            : "bg-blue-50 border-blue-100 hover:bg-blue-100"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {task.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          ) : task.priority === "high" ? (
                            <Flag className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          ) : null}
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate">
                              {task.title}
                            </div>
                            {task.description && (
                              <div className="text-xs text-gray-600 truncate group-hover:whitespace-normal">
                                {task.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};