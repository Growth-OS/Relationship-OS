import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { CalendarIcon, CheckCircle2, Clock, ArrowRight, ListTodo } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { EditTaskDialog } from "./EditTaskDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface TaskListProps {
  source?: "other" | "deals" | "content" | "ideas" | "substack" | "projects";
  projectId?: string;
  showArchived?: boolean;
}

export const TaskList = ({ source, projectId, showArchived = false }: TaskListProps) => {
  const navigate = useNavigate();

  const { data: tasks = [], isLoading, error, refetch } = useQuery({
    queryKey: ["tasks", source, projectId, showArchived],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      let query = supabase
        .from("tasks")
        .select(`
          *,
          projects(id, name),
          deals!tasks_deal_id_fkey(id, company_name),
          substack_posts(id, title)
        `)
        .eq('user_id', user.user.id);

      if (source) {
        query = query.eq("source", source);
      }

      if (projectId) {
        query = query.eq("project_id", projectId);
      }

      if (!showArchived) {
        query = query.eq("completed", false);
      }

      const { data, error } = await query.order('due_date', { ascending: true });

      if (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }

      return data || [];
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

  const handleTaskClick = (task: any) => {
    if (task.source === 'projects' && task.projects) {
      navigate(`/dashboard/projects?id=${task.projects.id}`);
    } else if (task.source === 'deals' && task.deals) {
      navigate(`/dashboard/deals?id=${task.deals.id}`);
    } else if (task.source === 'substack' && task.substack_posts) {
      navigate(`/dashboard/substack?id=${task.substack_posts.id}`);
    } else if (task.source === 'ideas') {
      navigate('/dashboard/development');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'projects':
        return <ListTodo className="w-4 h-4 text-blue-500" />;
      case 'deals':
        return <ArrowRight className="w-4 h-4 text-green-500" />;
      case 'substack':
        return <Clock className="w-4 h-4 text-purple-500" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse bg-gray-50" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-500 p-4 bg-red-50 rounded-lg">
        Error loading tasks. Please try again.
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <Card 
          key={task.id} 
          className={cn(
            "p-4 hover:shadow-md transition-all duration-200 cursor-pointer group",
            task.completed ? "bg-gray-50" : "bg-white"
          )}
          onClick={() => handleTaskClick(task)}
        >
          <div className="flex items-start gap-4">
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="pt-1"
            >
              <Checkbox
                checked={task.completed || false}
                onCheckedChange={(checked) => {
                  handleComplete(task.id, checked as boolean);
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <h3 className={cn(
                    "font-medium truncate",
                    task.completed && "text-gray-500 line-through"
                  )}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {task.priority && (
                    <Badge className={cn("border", getPriorityColor(task.priority))}>
                      {task.priority}
                    </Badge>
                  )}
                  <div 
                    onClick={(e) => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <EditTaskDialog task={task} onUpdate={refetch} />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                {task.source && getSourceIcon(task.source)}
                {task.due_date && (
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Due {format(new Date(task.due_date), 'MMM d, yyyy')}</span>
                  </div>
                )}
                {task.projects?.name && (
                  <Badge variant="outline" className="text-blue-600">
                    {task.projects.name}
                  </Badge>
                )}
                {task.deals?.company_name && (
                  <Badge variant="outline" className="text-green-600">
                    {task.deals.company_name}
                  </Badge>
                )}
              </div>
            </div>

            {task.completed && (
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};