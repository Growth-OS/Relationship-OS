import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isWeekend } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
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
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Project Timeline</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium text-gray-600">
            {format(startDate, "d MMM")} - {format(endDate, "d MMM yyyy")}
          </span>
          <Button variant="outline" size="sm" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="mb-6">
              <div className="grid grid-cols-7 gap-4 mb-2">
                {week.map((day) => (
                  <div
                    key={day.toString()}
                    className={cn(
                      "text-sm font-medium",
                      isWeekend(day) ? "text-gray-400" : "text-gray-600"
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
                      "min-h-[120px] rounded-lg p-2 transition-colors",
                      isWeekend(day) ? "bg-gray-50/50" : "bg-white",
                      isToday(day) && "ring-2 ring-primary ring-offset-2",
                      "border border-gray-100 hover:border-gray-200"
                    )}
                  >
                    {getTasksForDay(day).map((task) => (
                      <Card
                        key={task.id}
                        className={cn(
                          "p-2 mb-2 text-sm group hover:shadow-md transition-all",
                          task.completed
                            ? "bg-green-50 border-green-100 hover:bg-green-100"
                            : task.priority === "high"
                            ? "bg-red-50 border-red-100 hover:bg-red-100"
                            : "bg-blue-50 border-blue-100 hover:bg-blue-100"
                        )}
                      >
                        <div className="font-medium truncate">{task.title}</div>
                        {task.description && (
                          <div className="text-xs text-gray-600 truncate group-hover:whitespace-normal">
                            {task.description}
                          </div>
                        )}
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