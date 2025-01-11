import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, DollarSign, Clock, Users, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  client_name: string;
  status: string;
  budget: number;
  start_date: string;
  end_date: string;
  last_activity_date: string;
}

interface ProjectsGridProps {
  projects: Project[];
  isLoading: boolean;
}

export const ProjectsGrid = ({ projects, isLoading }: ProjectsGridProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-6 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </Card>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No projects found</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800";
      case "on_hold":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="group relative p-6 shadow-md dark:shadow-gray-950/50 hover:shadow-lg transition-all duration-200 cursor-pointer border-[1.5px] border-gray-200/80 dark:border-gray-800/80 bg-white/50 dark:bg-gray-900/50 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700"
          onClick={() => navigate(`/dashboard/projects/${project.id}`)}
        >
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>

          <div className="space-y-5">
            <div>
              <Badge className={`${getStatusColor(project.status)} border mb-3`}>
                {project.status}
              </Badge>
              <h3 className="font-semibold text-lg mt-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {project.name}
              </h3>
              <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4 mr-1.5 text-gray-500 dark:text-gray-400" />
                <span>{project.client_name}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
              {project.budget && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <DollarSign className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                  <span className="font-medium">${project.budget.toLocaleString()}</span>
                </div>
              )}
              
              {project.start_date && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                  <span>
                    {new Date(project.start_date).toLocaleDateString()}
                    {project.end_date &&
                      ` - ${new Date(project.end_date).toLocaleDateString()}`}
                  </span>
                </div>
              )}
              
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                <span>
                  Updated {formatDistanceToNow(new Date(project.last_activity_date), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};