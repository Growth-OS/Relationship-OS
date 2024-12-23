import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBarIcon, PieChart } from "lucide-react";
import { MonthlyLeadsChart } from "./MonthlyLeadsChart";
import { LeadSourcesChart } from "./LeadSourcesChart";
import { Database } from "@/integrations/supabase/types";

type Prospect = {
  created_at: string;
  source?: Database['public']['Enums']['lead_source'] | null;
};

interface LeadsChartSectionProps {
  prospects: Prospect[];
}

export const LeadsChartSection = ({ prospects }: LeadsChartSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">New Leads (12 Months)</CardTitle>
          <ChartBarIcon className="w-4 h-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <MonthlyLeadsChart prospects={prospects} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Lead Sources</CardTitle>
          <PieChart className="w-4 h-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <LeadSourcesChart prospects={prospects} />
        </CardContent>
      </Card>
    </div>
  );
};