import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";
import { TotalDealValueCard } from "@/components/reporting/TotalDealValueCard";
import { DealStageConversions } from "@/components/reporting/DealStageConversions";
import { LeadsChartSection } from "@/components/reporting/LeadsChartSection";
import { MonthlyChartsSection } from "@/components/reporting/MonthlyChartsSection";

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

  const { data: prospects = [] } = useQuery({
    queryKey: ['prospects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const totalDealValue = deals?.reduce((sum, deal) => sum + Number(deal.deal_value), 0) || 0;

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-1">Reporting</h1>
        <p className="text-sm text-gray-600">Track and analyze your business metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TotalDealValueCard totalDealValue={totalDealValue} />
        <DealStageConversions />
      </div>

      <LeadsChartSection prospects={prospects} />
      
      <MonthlyChartsSection 
        prospects={prospects}
        earnings={earnings || []}
      />
    </div>
  );
};

export default Reporting;