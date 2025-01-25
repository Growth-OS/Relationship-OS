import { Card } from "@/components/ui/card";
import { Building2, ListTodo, Receipt, Clock } from "lucide-react";

interface ProjectStatsProps {
  project: {
    id: string;
    name: string;
    status: string;
    budget?: number;
    start_date?: string;
    end_date?: string;
    totalTasks: number;
    completedTasks: number;
    totalDocuments: number;
  };
}

export const ProjectStats = ({ project }: ProjectStatsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20";
      case "completed":
        return "text-blue-500 bg-blue-50 dark:bg-blue-900/20";
      case "on_hold":
        return "text-amber-500 bg-amber-50 dark:bg-amber-900/20";
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-900/20";
    }
  };

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
      color: "text-purple-500 bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Tasks Progress",
      value: `${project.completedTasks}/${project.totalTasks}`,
      icon: ListTodo,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Documents",
      value: project.totalDocuments.toString(),
      icon: Receipt,
      color: "text-orange-500 bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};