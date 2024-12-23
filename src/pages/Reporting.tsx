import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyEarningsChart } from "@/components/reporting/MonthlyEarningsChart";
import { ChartBarIcon, PieChart } from "lucide-react";
import { DealsByCountryChart } from "@/components/reporting/DealsByCountryChart";
import { format, subDays } from "date-fns";

const Reporting = () => {
  const { data: earnings } = useQuery({
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

  const { data: deals } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .gte('created_at', thirtyDaysAgo)
        .not('stage', 'eq', 'paid');
      
      if (error) throw error;
      return data || [];
    },
  });

  const totalDealValue = deals?.reduce((sum, deal) => sum + Number(deal.deal_value), 0) || 0;

  const dealsByCountry = deals?.reduce((acc: Record<string, number>, deal) => {
    if (deal.country) {
      acc[deal.country] = (acc[deal.country] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-1">Reporting</h1>
        <p className="text-sm text-gray-600">Track and analyze your business metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Deal Value (30d)</p>
              <ChartBarIcon className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-3xl font-bold">${totalDealValue.toLocaleString()}</div>
          </div>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Deals by Country</CardTitle>
            <PieChart className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent className="pt-2">
            <DealsByCountryChart data={dealsByCountry || {}} />
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
};

export default Reporting;