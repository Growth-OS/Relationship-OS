import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { ProjectPortal } from "./ProjectPortal";

interface Project {
  id: string;
  name?: string;
  company_name: string;
  contact_email: string | null;
  first_name: string | null;
  company_website: string | null;
  training_event: string | null;
  status: string;
}

interface ProjectsListProps {
  projects: Project[];
  isLoading: boolean;
  filters: Array<{ field: string; value: string }>;
}

export const ProjectsList = ({ projects, isLoading, filters }: ProjectsListProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  const filteredProjects = projects.filter(project => {
    return filters.every(filter => {
      const value = project[filter.field as keyof Project];
      if (!value) return false;
      return value.toLowerCase().includes(filter.value.toLowerCase());
    });
  });

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No prospects found matching the current filters
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Name</TableHead>
            <TableHead className="text-left">Email</TableHead>
            <TableHead className="text-left">First Name</TableHead>
            <TableHead className="text-left">Website</TableHead>
            <TableHead className="text-left">Accelerator Program</TableHead>
            <TableHead className="text-left">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProjects.map((project) => (
            <TableRow
              key={project.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedProject(project)}
            >
              <TableCell className="text-left font-medium">{project.company_name}</TableCell>
              <TableCell className="text-left">{project.contact_email}</TableCell>
              <TableCell className="text-left">{project.first_name}</TableCell>
              <TableCell className="text-left">
                {project.company_website && (
                  <a 
                    href={project.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {project.company_website}
                  </a>
                )}
              </TableCell>
              <TableCell className="text-left">{project.training_event}</TableCell>
              <TableCell className="text-left">
                <Badge 
                  variant={project.status === 'active' ? 'default' : 'secondary'}
                >
                  {project.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ProjectPortal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
};