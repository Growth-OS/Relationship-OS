import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TaskCard } from "./TaskCard";
import { TaskListSkeleton } from "./TaskListSkeleton";
import { EmptyTaskList } from "./EmptyTaskList";
import { TaskGroup } from "@/components/dashboard/TaskGroup";
import { DateRange } from "react-day-picker";
import { addDays, subMonths } from "date-fns";
import { DateRangePicker } from "../ui/date-range-picker";
import { TaskPagination } from "./TaskPagination";
import { TaskListProps, TasksResponse } from "./types";

const TASKS_PER_PAGE = 10;

export const TaskList = ({ source, projectId, showArchived = false }: TaskListProps) => {
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  const { data, isLoading, error, refetch } = useQuery<TasksResponse>({
    queryKey: ["tasks", source, projectId, showArchived, page, dateRange],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      let query = supabase
        .from("tasks")
        .select(`
          *,
          projects(id, name),
          deals(id, company_name),
          substack_posts(id, title),
          sequences(id, name)
        `)
        .eq('user_id', user.user.id);

      if (source) {
        query = query.eq("source", source);
      }

      if (projectId) {
        query = query.eq("project_id", projectId);
      }

      if (showArchived) {
        query = query.eq("completed", true);
        
        // Apply date range filter for archived tasks
        if (dateRange?.from) {
          query = query.gte('created_at', dateRange.from.toISOString());
        }
        if (dateRange?.to) {
          query = query.lte('created_at', addDays(dateRange.to, 1).toISOString());
        }
      } else {
        query = query.eq("completed", false);
      }

      // Add pagination
      const start = (page - 1) * TASKS_PER_PAGE;
      query = query
        .order('created_at', { ascending: false })
        .range(start, start + TASKS_PER_PAGE - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching tasks:", error);
        throw new Error("Failed to fetch tasks: " + error.message);
      }

      return {
        tasks: data || [],
        totalCount: count || 0,
      };
    },
  });

  const handleComplete = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ completed })
        .eq("id", taskId);

      if (error) {
        console.error("Error updating task:", error);
        toast.error("Failed to update task status");
        return;
      }

      toast.success(completed ? "Task marked as complete" : "Task marked as incomplete");
      refetch();
    } catch (err) {
      console.error("Failed to update task:", err);
      toast.error("Failed to update task status");
    }
  };

  if (isLoading) {
    return <TaskListSkeleton />;
  }

  if (error) {
    console.error("Task list error:", error);
    return (
      <div className="text-sm text-red-500 p-4 bg-red-50 rounded-lg max-w-3xl">
        Error loading tasks: {error.message || "Please try again"}
      </div>
    );
  }

  if (!data || data.tasks.length === 0) {
    return <EmptyTaskList />;
  }

  const totalPages = Math.ceil(data.totalCount / TASKS_PER_PAGE);

  return (
    <div className="space-y-6">
      {showArchived && (
        <div className="mb-6">
          <DateRangePicker
            date={dateRange}
            onSelect={setDateRange}
          />
        </div>
      )}

      {source ? (
        <TaskGroup 
          source={source} 
          tasks={data.tasks}
          onComplete={handleComplete}
          onUpdate={refetch}
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(data.tasks.reduce((acc: Record<string, any[]>, task) => {
            const taskSource = task.source || 'other';
            if (!acc[taskSource]) {
              acc[taskSource] = [];
            }
            acc[taskSource].push(task);
            return acc;
          }, {})).map(([taskSource, tasks]) => (
            <TaskGroup 
              key={taskSource} 
              source={taskSource as any} 
              tasks={tasks}
              onComplete={handleComplete}
              onUpdate={refetch}
            />
          ))}
        </div>
      )}

      {showArchived && (
        <TaskPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};