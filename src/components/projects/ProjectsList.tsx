import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Prospect } from "@/types/prospects";

interface ProjectsListProps {
  projects: Prospect[];
  isLoading: boolean;
  filters: Array<{ field: string; value: string }>;
}

export const ProjectsList = ({ projects, isLoading, filters }: ProjectsListProps) => {
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
      const value = project[filter.field as keyof Prospect];
      if (!value) return false;
      return String(value).toLowerCase().includes(filter.value.toLowerCase());
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Company Name</TableHead>
          <TableHead className="text-left">Email</TableHead>
          <TableHead className="text-left">First Name</TableHead>
          <TableHead className="text-left">Website</TableHead>
          <TableHead className="text-left">Accelerator Program</TableHead>
          <TableHead className="text-left">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredProjects.map((project) => (
          <TableRow key={project.id} className="hover:bg-muted/50">
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
                >
                  {project.company_website}
                </a>
              )}
            </TableCell>
            <TableCell className="text-left">{project.training_event}</TableCell>
            <TableCell className="text-left">{project.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};