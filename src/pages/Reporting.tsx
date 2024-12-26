import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TotalDealValueCard } from "@/components/reporting/TotalDealValueCard";
import { DealStageConversions } from "@/components/reporting/DealStageConversions";
import { LeadsChartSection } from "@/components/reporting/LeadsChartSection";
import { MonthlyChartsSection } from "@/components/reporting/MonthlyChartsSection";
import { ModuleFilter } from "@/components/reporting/ModuleFilter";
import { SubstackReporting } from "@/components/substack/reporting/SubstackReporting";
import { FinancialReporting } from "@/components/reporting/FinancialReporting";
import { useState } from "react";

const Reporting = () => {
  const [selectedModule, setSelectedModule] = useState("all");

  const { data: earnings } = useQuery({
    queryKey: ['affiliateEarnings'],
    queryFn: async () => {
      if (selectedModule !== 'all' && selectedModule !== 'affiliate') return [];
      
      const { data, error } = await supabase
        .from('affiliate_earnings')
        .select('amount, date')
        .order('date');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: deals } = useQuery({
    queryKey: ['deals', selectedModule],
    queryFn: async () => {
      if (selectedModule !== 'all' && selectedModule !== 'deals') return [];

      const { data, error } = await supabase
        .from('deals')
        .select('*')
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

  const totalDealValue = deals?.reduce((sum, deal) => sum + Number(deal.deal_value), 0) || 0;

  const shouldShowDeals = selectedModule === 'all' || selectedModule === 'deals';
  const shouldShowProspects = selectedModule === 'all' || selectedModule === 'prospects';
  const shouldShowAffiliates = selectedModule === 'all' || selectedModule === 'affiliate';
  const shouldShowSubstack = selectedModule === 'all' || selectedModule === 'substack';
  const shouldShowFinances = selectedModule === 'all' || selectedModule === 'finances';

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">Reporting</h1>
          <p className="text-sm text-gray-600">Track and analyse your business metrics</p>
        </div>
        <ModuleFilter 
          value={selectedModule} 
          onChange={setSelectedModule} 
        />
      </div>

      {shouldShowDeals && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TotalDealValueCard totalDealValue={totalDealValue} />
          <DealStageConversions />
        </div>
      )}

      {shouldShowProspects && (
        <LeadsChartSection prospects={prospects} />
      )}
      
      {shouldShowAffiliates && (
        <MonthlyChartsSection 
          prospects={prospects}
          earnings={earnings || []}
        />
      )}

      {shouldShowSubstack && (
        <SubstackReporting />
      )}

      {shouldShowFinances && (
        <FinancialReporting />
      )}
    </div>
  );
};

export default Reporting;