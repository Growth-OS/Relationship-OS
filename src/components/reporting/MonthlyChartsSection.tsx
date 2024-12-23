import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBarIcon } from "lucide-react";
import { MonthlyConversionsChart } from "./MonthlyConversionsChart";
import { MonthlyEarningsChart } from "./MonthlyEarningsChart";

interface MonthlyChartsSectionProps {
  prospects: Array<{ created_at: string; status?: string | null }>;
  earnings: Array<{ amount: number; date: string }>;
}

export const MonthlyChartsSection = ({ prospects, earnings }: MonthlyChartsSectionProps) => {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Monthly Conversions</CardTitle>
          <ChartBarIcon className="w-4 h-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <MonthlyConversionsChart prospects={prospects} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-base font-medium">
            Monthly Earnings Overview
          </CardTitle>
          <ChartBarIcon className="w-4 h-4 text-gray-500" />
        </CardHeader>
        <CardContent className="pt-0">
          <MonthlyEarningsChart earnings={earnings || []} />
        </CardContent>
      </Card>
    </>
  );
};