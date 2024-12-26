import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, differenceInDays, addDays } from "date-fns";

interface Project {
  id: string;
  name: string;
  client_name: string;
  status: string;
  start_date: string;
  end_date: string;
}

interface ProjectsTimelineProps {
  projects: Project[];
  isLoading: boolean;
}

export const ProjectsTimeline = ({ projects, isLoading }: ProjectsTimelineProps) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const projectsWithDates = projects.filter(
    (project) => project.start_date && project.end_date
  );

  if (projectsWithDates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No projects with timeline information</p>
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

  const earliestDate = new Date(
    Math.min(...projectsWithDates.map((p) => new Date(p.start_date).getTime()))
  );
  const latestDate = new Date(
    Math.max(...projectsWithDates.map((p) => new Date(p.end_date).getTime()))
  );
  const totalDays = differenceInDays(latestDate, earliestDate) + 1;

  return (
    <div className="space-y-4 mt-6">
      {projectsWithDates.map((project) => {
        const start = new Date(project.start_date);
        const end = new Date(project.end_date);
        const offsetDays = differenceInDays(start, earliestDate);
        const duration = differenceInDays(end, start) + 1;
        const widthPercentage = (duration / totalDays) * 100;
        const leftPercentage = (offsetDays / totalDays) * 100;

        return (
          <div key={project.id} className="relative h-20">
            <div className="absolute inset-y-0 left-0 w-full bg-gray-50 rounded">
              <div
                className="absolute h-full bg-gray-100 rounded"
                style={{
                  left: `${leftPercentage}%`,
                  width: `${widthPercentage}%`,
                }}
              >
                <Card className="absolute top-0 left-0 right-0 m-2 p-2 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-gray-600">{project.client_name}</p>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );
      })}
      
      <div className="flex justify-between text-sm text-gray-500 mt-2">
        <span>{format(earliestDate, "MMM d, yyyy")}</span>
        <span>{format(latestDate, "MMM d, yyyy")}</span>
      </div>
    </div>
  );
};