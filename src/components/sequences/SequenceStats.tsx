import { Card } from "@/components/ui/card";
import { Play, Pause, CheckCircle, Users } from "lucide-react";
import { type Sequence } from "./types";

interface SequenceStatsProps {
  sequences: Sequence[];
}

export const SequenceStats = ({ sequences }: SequenceStatsProps) => {
  const activeSequences = sequences.filter((s) => s.status === "active").length;
  const pausedSequences = sequences.filter((s) => s.status === "paused").length;
  const completedSequences = sequences.filter((s) => s.status === "completed").length;
  const totalProspects = sequences.reduce(
    (sum, s) => sum + s.sequence_assignments.length,
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-full">
            <Play className="h-6 w-6 text-green-500 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active</p>
            <h3 className="text-2xl font-bold">{activeSequences}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-full">
            <Pause className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Paused</p>
            <h3 className="text-2xl font-bold">{pausedSequences}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
            <CheckCircle className="h-6 w-6 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Completed</p>
            <h3 className="text-2xl font-bold">{completedSequences}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-full">
            <Users className="h-6 w-6 text-purple-500 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Prospects</p>
            <h3 className="text-2xl font-bold">{totalProspects}</h3>
          </div>
        </div>
      </Card>
    </div>
  );
};