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
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <Clock className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">Active Projects</p>
            <h3 className="text-2xl font-bold">{activeProjects}</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">Completed</p>
            <h3 className="text-2xl font-bold">{completedProjects}</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <AlertCircle className="h-8 w-8 text-yellow-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">On Hold</p>
            <h3 className="text-2xl font-bold">{onHoldProjects}</h3>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <DollarSign className="h-8 w-8 text-purple-500" />
          <div>
            <p className="text-sm font-medium text-gray-500">Total Budget</p>
            <h3 className="text-2xl font-bold">${totalBudget.toLocaleString()}</h3>
          </div>
        </div>
      </Card>
    </div>
  );
};