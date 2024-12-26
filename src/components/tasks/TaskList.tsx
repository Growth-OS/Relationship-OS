import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TaskListProps {
  source?: "other" | "deals" | "content" | "ideas" | "substack" | "projects";
  projectId?: string;
  showArchived?: boolean;
}

export const TaskList = ({ source, projectId, showArchived = false }: TaskListProps) => {
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", source, projectId, showArchived],
    queryFn: async () => {
      let query = supabase
        .from("tasks")
        .select("*");

      if (source) {
        query = query.eq("source", source);
      }

      if (projectId) {
        query = query.eq("project_id", projectId);
      }

      if (!showArchived) {
        query = query.eq("completed", false);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="p-4 border rounded-lg">
          <h3 className="font-medium">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};