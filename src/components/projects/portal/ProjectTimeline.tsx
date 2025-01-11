import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ProjectTimelineProps {
  projectId: string;
}

export const ProjectTimeline = ({ projectId }: ProjectTimelineProps) => {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["project-tasks", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId)
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading timeline...</div>;
  }

  if (!tasks?.length) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">No tasks found for this project</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-muted-foreground">{task.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {task.priority && (
                <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>
                  {task.priority}
                </Badge>
              )}
              {task.completed && (
                <Badge variant="success">Completed</Badge>
              )}
            </div>
          </div>
          {task.due_date && (
            <p className="text-sm text-muted-foreground mt-2">
              Due: {format(new Date(task.due_date), "PPP")}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
};