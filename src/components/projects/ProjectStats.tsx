import { Card } from "@/components/ui/card";
import { Clock, CheckCircle, AlertCircle, DollarSign } from "lucide-react";

interface Project {
  id: string;
  status: string;
  budget?: number;
}

interface ProjectStatsProps {
  projects: Project[];
}

export const ProjectStats = ({ projects }: ProjectStatsProps) => {
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const completedProjects = projects.filter((p) => p.status === "completed").length;
  const onHoldProjects = projects.filter((p) => p.status === "on_hold").length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
            <Clock className="h-6 w-6 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
            <h3 className="text-2xl font-bold">{activeProjects}</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-full">
            <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Completed</p>
            <h3 className="text-2xl font-bold">{completedProjects}</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-full">
            <AlertCircle className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">On Hold</p>
            <h3 className="text-2xl font-bold">{onHoldProjects}</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-full">
            <DollarSign className="h-6 w-6 text-purple-500 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
            <h3 className="text-2xl font-bold">€{totalBudget.toLocaleString()}</h3>
          </div>
        </div>
      </Card>
    </div>
  );
};