import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ProjectPortal } from "./ProjectPortal";
import { useState } from "react";

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

interface ProjectsListProps {
  projects: Project[];
  isLoading: boolean;
}

export const ProjectsList = ({ projects, isLoading }: ProjectsListProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (isLoading) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  if (!projects.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No projects found. Create your first project to get started.
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
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Last Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow 
                key={project.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedProject(project)}
              >
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>{project.client_name}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {project.budget ? (
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-gray-500" />
                      {project.budget.toLocaleString()}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {project.start_date && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                      <span>
                        {format(new Date(project.start_date), "MMM d, yyyy")}
                        {project.end_date && (
                          <> - {format(new Date(project.end_date), "MMM d, yyyy")}</>
                        )}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(project.last_activity_date), "MMM d, yyyy")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProjectPortal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};