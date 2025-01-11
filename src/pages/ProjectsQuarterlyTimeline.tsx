import { QuarterlyTimeline } from "@/components/projects/QuarterlyTimeline";

const ProjectsQuarterlyTimeline = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quarterly Timeline</h1>
          <p className="text-muted-foreground">View and manage project tasks by quarter</p>
        </div>
      </div>

      <QuarterlyTimeline />
    </div>
  );
};

export default ProjectsQuarterlyTimeline;