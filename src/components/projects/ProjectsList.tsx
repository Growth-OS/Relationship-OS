import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
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

interface ProjectsListProps {
  projects: Project[];
  isLoading: boolean;
}

export const ProjectsList = ({ projects, isLoading }: ProjectsListProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "on_hold":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
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
            onClick={() => navigate(`/dashboard/projects/${project.id}`)}
          >
            <TableCell className="font-medium">{project.name}</TableCell>
            <TableCell>{project.client_name}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
            </TableCell>
            <TableCell>${project.budget?.toLocaleString()}</TableCell>
            <TableCell>
              {project.start_date && (
                <>
                  {format(new Date(project.start_date), "MMM d, yyyy")}
                  {project.end_date && (
                    <> - {format(new Date(project.end_date), "MMM d, yyyy")}</>
                  )}
                </>
              )}
            </TableCell>
            <TableCell>
              {format(new Date(project.last_activity_date), "MMM d, yyyy")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};