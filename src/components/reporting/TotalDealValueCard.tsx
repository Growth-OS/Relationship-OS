import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TotalDealValueCardProps {
  totalDealValue: number;
  goalAmount?: number; // Made optional with a default value
}

export const TotalDealValueCard = ({ 
  totalDealValue, 
  goalAmount = 100000 // Default goal if not specified
}: TotalDealValueCardProps) => {
  // Calculate percentage towards goal
  const percentage = Math.min((totalDealValue / goalAmount) * 100, 100);

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">Total Deal Value (30d)</p>
          <div className="text-3xl font-bold text-primary">
            €{totalDealValue.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">
            {percentage.toFixed(1)}% of €{goalAmount.toLocaleString()} goal
          </p>
        </div>
        
        <div className="relative pt-2">
          <Progress 
            value={percentage} 
            className="h-2 bg-primary/20"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Average Deal</p>
            <p className="text-lg font-semibold">
              €{(totalDealValue / 2).toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Active Deals</p>
            <p className="text-lg font-semibold">2</p>
          </div>
        </div>
      </div>
    </Card>
  );
};