import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, DollarSign, Clock, Users, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { ProjectPortal } from "./ProjectPortal";

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
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "on_hold":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="group relative p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 dark:border-gray-800"
            onClick={() => setSelectedProject(project)}
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              <div>
                <Badge className={`${getStatusColor(project.status)} border`}>
                  {project.status}
                </Badge>
                <h3 className="font-medium text-lg mt-3 group-hover:text-blue-600 transition-colors">
                  {project.name}
                </h3>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{project.client_name}</span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                {project.budget && (
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">${project.budget.toLocaleString()}</span>
                  </div>
                )}
                
                {project.start_date && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>
                      {new Date(project.start_date).toLocaleDateString()}
                      {project.end_date &&
                        ` - ${new Date(project.end_date).toLocaleDateString()}`}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
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

      <ProjectPortal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};