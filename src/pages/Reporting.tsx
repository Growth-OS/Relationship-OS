import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyEarningsChart } from "@/components/reporting/MonthlyEarningsChart";
import { ChartBarIcon } from "lucide-react";

const Reporting = () => {
  const { data: earnings, isLoading } = useQuery({
    queryKey: ['affiliateEarnings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('affiliate_earnings')
        .select('amount, date')
        .order('date');
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">Reporting</h1>
        <p className="text-gray-600">Track and analyze your affiliate earnings</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">
            Monthly Earnings Overview
          </CardTitle>
          <ChartBarIcon className="w-4 h-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <MonthlyEarningsChart earnings={earnings || []} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Reporting;