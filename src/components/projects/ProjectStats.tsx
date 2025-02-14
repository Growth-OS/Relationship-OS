import { Card } from "@/components/ui/card";
import { Building2, ListTodo, Receipt, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectStatsProps {
  project: {
    id: string;
    name: string;
    status: string;
    budget?: number;
    start_date?: string;
    end_date?: string;
    project_documents?: {
      id: string;
    }[];
  };
}

export const ProjectStats = ({ project }: ProjectStatsProps) => {
  // Fetch tasks using the same query as Timeline and All Tasks
  const { data: tasks = [] } = useQuery({
    queryKey: ["project-tasks", project.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("source", "projects")
        .eq("source_id", project.id);

      if (error) throw error;
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-emerald-400 bg-emerald-950/20";
      case "completed":
        return "text-blue-400 bg-blue-950/20";
      case "on_hold":
        return "text-amber-400 bg-amber-950/20";
      default:
        return "text-gray-400 bg-gray-800/20";
    }
  };

  // Calculate task statistics using the fetched tasks
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalDocuments = project.project_documents?.length || 0;

  const stats = [
    {
      title: "Project Status",
      value: project.status?.charAt(0).toUpperCase() + project.status?.slice(1) || "Not Set",
      icon: Clock,
      color: getStatusColor(project.status),
    },
    {
      title: "Budget",
      value: project.budget ? `€${project.budget.toLocaleString()}` : "Not Set",
      icon: Building2,
      color: "text-purple-400 bg-purple-950/20",
    },
    {
      title: "Tasks Progress",
      value: `${completedTasks}/${totalTasks}`,
      icon: ListTodo,
      color: "text-blue-400 bg-blue-950/20",
    },
    {
      title: "Documents",
      value: totalDocuments.toString(),
      icon: Receipt,
      color: "text-orange-400 bg-orange-950/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="p-4 border-0 bg-gray-800/20 backdrop-blur-sm hover:bg-gray-800/30 transition-all duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">{stat.title}</p>
              <h3 className="text-xl font-bold text-white">{stat.value}</h3>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};