import { Card } from "@/components/ui/card";
import { ChartBarIcon } from "lucide-react";

interface TotalDealValueCardProps {
  totalDealValue: number;
}

export const TotalDealValueCard = ({ totalDealValue }: TotalDealValueCardProps) => {
  return (
    <Card className="p-4">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Total Deal Value (30d)</p>
          <ChartBarIcon className="w-4 h-4 text-gray-500" />
        </div>
        <div className="text-3xl font-bold">${totalDealValue.toLocaleString()}</div>
      </div>
    </Card>
  );
};