import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, DollarSign, Clock, Users, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { ProjectPortal } from "./ProjectPortal";
import { cn } from "@/lib/utils";

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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
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

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "active":
        return {
          icon: Circle,
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          badge: "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200"
        };
      case "completed":
        return {
          icon: CheckCircle2,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          badge: "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-200"
        };
      default:
        return {
          icon: Circle,
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          badge: "bg-gray-100 text-gray-700 border-gray-200"
        };
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const statusDetails = getStatusDetails(project.status);
          const StatusIcon = statusDetails.icon;

          return (
            <Card
              key={project.id}
              className={cn(
                "group relative p-6 transition-all duration-300",
                "hover:shadow-lg hover:shadow-gray-200/50",
                "border border-gray-100",
                "bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/80",
                "hover:bg-gradient-to-br hover:from-white hover:to-gray-50/80",
                "hover:border-gray-200",
                "hover:scale-[1.02] hover:-translate-y-1",
                "cursor-pointer"
              )}
              onClick={() => setSelectedProject(project)}
            >
              <div className="space-y-4">
                <div>
                  <Badge 
                    className={cn(
                      "mb-3 border transition-colors duration-300",
                      statusDetails.badge
                    )}
                  >
                    <StatusIcon className={cn("w-3.5 h-3.5 mr-1", statusDetails.color)} />
                    {project.status}
                  </Badge>
                  
                  <h3 className="font-semibold text-lg mt-2 text-gray-800 group-hover:text-purple-600 transition-colors">
                    {project.name}
                  </h3>
                  
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <div className={cn("p-1.5 rounded-full mr-2", statusDetails.bgColor)}>
                      <Users className={cn("w-4 h-4", statusDetails.color)} />
                    </div>
                    <span>{project.client_name}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  {project.budget && (
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="p-1.5 rounded-full mr-2 bg-gray-50">
                        <DollarSign className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="font-medium font-mono">
                        €{project.budget.toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  {project.start_date && (
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="p-1.5 rounded-full mr-2 bg-gray-50">
                        <Calendar className="w-4 h-4 text-gray-600" />
                      </div>
                      <span>
                        {new Date(project.start_date).toLocaleDateString()}
                        {project.end_date &&
                          ` - ${new Date(project.end_date).toLocaleDateString()}`}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="p-1.5 rounded-full mr-2 bg-gray-50">
                      <Clock className="w-4 h-4 text-gray-600" />
                    </div>
                    <span>
                      Updated {formatDistanceToNow(new Date(project.last_activity_date), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <ProjectPortal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};