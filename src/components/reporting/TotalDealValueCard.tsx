import { Card } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface TotalDealValueCardProps {
  totalDealValue: number;
}

export const TotalDealValueCard = ({ totalDealValue }: TotalDealValueCardProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-medium">Total Deal Value (30d)</p>
          <div className="p-2 bg-primary/10 rounded-full">
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="text-3xl font-bold text-primary">
          €{totalDealValue.toLocaleString()}
        </div>
        <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${Math.min((totalDealValue / 100000) * 100, 100)}%` }}
          />
        </div>
      </div>
    </Card>
  );
};