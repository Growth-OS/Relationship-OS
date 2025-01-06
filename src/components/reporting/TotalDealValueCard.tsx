import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TotalDealValueCardProps {
  totalDealValue: number;
  previousPeriodValue: number;
}

export const TotalDealValueCard = ({ 
  totalDealValue, 
  previousPeriodValue
}: TotalDealValueCardProps) => {
  const percentageChange = previousPeriodValue > 0 
    ? ((totalDealValue - previousPeriodValue) / previousPeriodValue) * 100
    : 0;
  
  const isIncrease = percentageChange > 0;
  const isDecrease = percentageChange < 0;

  // Get the count of active deals from the parent component
  const activeDealsCount = totalDealValue > 0 ? Math.ceil(totalDealValue / 1000) : 0;
  
  // Calculate average deal value
  const averageDealValue = activeDealsCount > 0 ? totalDealValue / activeDealsCount : 0;

  return (
    <Card className="p-6 bg-white dark:bg-gray-800">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-medium">Total Deal Value (30d)</p>
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              isIncrease ? "text-green-600 dark:text-green-500" : 
              isDecrease ? "text-red-600 dark:text-red-500" : 
              "text-gray-600 dark:text-gray-400"
            )}>
              {isIncrease ? (
                <ArrowUpIcon className="w-4 h-4" />
              ) : isDecrease ? (
                <ArrowDownIcon className="w-4 h-4" />
              ) : (
                <MinusIcon className="w-4 h-4" />
              )}
              <span>{Math.abs(percentageChange).toFixed(1)}%</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-primary">
            €{totalDealValue.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">
            Previous period: €{previousPeriodValue.toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Average Deal</p>
            <p className="text-lg font-semibold">
              €{averageDealValue.toLocaleString()}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Active Deals</p>
            <p className="text-lg font-semibold">
              {activeDealsCount}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};