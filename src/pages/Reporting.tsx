import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TotalDealValueCard } from "@/components/reporting/TotalDealValueCard";
import { DealStageConversions } from "@/components/reporting/DealStageConversions";
import { LeadsChartSection } from "@/components/reporting/LeadsChartSection";
import { MonthlyChartsSection } from "@/components/reporting/MonthlyChartsSection";
import { ModuleFilter } from "@/components/reporting/ModuleFilter";
import { FinancialReporting } from "@/components/reporting/FinancialReporting";
import { SequenceMetrics } from "@/components/reporting/SequenceMetrics";
import { useState } from "react";
import { subDays } from "date-fns";

const Reporting = () => {
  const [selectedModule, setSelectedModule] = useState("all");

  const { data: currentDeals = [] } = useQuery({
    queryKey: ['deals', 'current', selectedModule],
    queryFn: async () => {
      if (selectedModule !== 'all' && selectedModule !== 'deals') return [];

      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .gte('created_at', thirtyDaysAgo)
        .in('stage', ['lead', 'meeting', 'negotiation', 'project_preparation', 'in_progress']);
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: previousDeals = [] } = useQuery({
    queryKey: ['deals', 'previous', selectedModule],
    queryFn: async () => {
      if (selectedModule !== 'all' && selectedModule !== 'deals') return [];

      const sixtyDaysAgo = subDays(new Date(), 60).toISOString();
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .gte('created_at', sixtyDaysAgo)
        .lt('created_at', thirtyDaysAgo)
        .in('stage', ['lead', 'meeting', 'negotiation', 'project_preparation', 'in_progress']);
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: prospects = [] } = useQuery({
    queryKey: ['prospects', selectedModule],
    queryFn: async () => {
      if (selectedModule !== 'all' && selectedModule !== 'prospects') return [];

      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: earnings = [] } = useQuery({
    queryKey: ['affiliate_earnings', selectedModule],
    queryFn: async () => {
      if (selectedModule !== 'all' && selectedModule !== 'affiliate') return [];

      const { data, error } = await supabase
        .from('affiliate_earnings')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const totalDealValue = currentDeals.reduce((sum, deal) => sum + Number(deal.deal_value), 0);
  const previousPeriodValue = previousDeals.reduce((sum, deal) => sum + Number(deal.deal_value), 0);

  const shouldShowDeals = selectedModule === 'all' || selectedModule === 'deals';
  const shouldShowProspects = selectedModule === 'all' || selectedModule === 'prospects';
  const shouldShowAffiliates = selectedModule === 'all' || selectedModule === 'affiliate';
  const shouldShowFinances = selectedModule === 'all' || selectedModule === 'finances';
  const shouldShowSequences = selectedModule === 'all' || selectedModule === 'sequences';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Reporting Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track and analyse your business metrics
            </p>
          </div>
          <ModuleFilter 
            value={selectedModule} 
            onChange={setSelectedModule} 
          />
        </div>
      </div>

      <div className="grid gap-6">
        {shouldShowDeals && (
          <>
            <TotalDealValueCard 
              totalDealValue={totalDealValue}
              previousPeriodValue={previousPeriodValue}
            />
            <DealStageConversions />
          </>
        )}

        {shouldShowProspects && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <LeadsChartSection prospects={prospects} />
          </div>
        )}
        
        {shouldShowAffiliates && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <MonthlyChartsSection 
              prospects={prospects}
              earnings={earnings}
            />
          </div>
        )}

        {shouldShowFinances && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <FinancialReporting />
          </div>
        )}

        {shouldShowSequences && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <SequenceMetrics />
          </div>
        )}
      </div>
    </div>
  );
};

export default Reporting;