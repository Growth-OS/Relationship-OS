import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfYear, endOfYear, format } from 'date-fns';
import { Progress } from "@/components/ui/progress";

export const DealStageConversions = () => {
  const { data: deals = [] } = useQuery({
    queryKey: ['deals', 'conversions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log('Fetched deals:', data);
      return data;
    },
  });

  const { data: prospects = [] } = useQuery({
    queryKey: ['prospects', 'conversions'],
    queryFn: async () => {
      const start = format(startOfYear(new Date()), 'yyyy-MM-dd');
      const end = format(endOfYear(new Date()), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .gte('created_at', start)
        .lte('created_at', end);
      
      if (error) throw error;
      
      console.log('Raw prospects data:', data);
      console.log('Total prospects count:', data?.length);
      console.log('Prospects by status:', data?.reduce((acc, p) => {
        acc[p.status || 'no_status'] = (acc[p.status || 'no_status'] || 0) + 1;
        return acc;
      }, {}));
      
      return data;
    },
  });

  const getConversionRate = (fromStage: string, toStage: string) => {
    const stages = ['lead', 'meeting', 'negotiation', 'project_preparation', 'in_progress', 'to_invoice', 'invoiced', 'paid'];
    const fromStageIndex = stages.indexOf(fromStage);
    const toStageIndex = stages.indexOf(toStage);
    
    const fromCount = deals.filter(deal => {
      const stageIndex = stages.indexOf(deal.stage);
      return stageIndex >= fromStageIndex;
    }).length;
    
    const toCount = deals.filter(deal => {
      const stageIndex = stages.indexOf(deal.stage);
      return stageIndex >= toStageIndex;
    }).length;
    
    console.log(`Conversion ${fromStage} -> ${toStage}:`, { fromStageIndex, toStageIndex, fromCount, toCount });
    
    if (fromCount === 0) return 0;
    return Math.round((toCount / fromCount) * 100);
  };

  const getProspectToLeadRate = () => {
    const totalProspects = prospects.length;
    const convertedProspects = prospects.filter(prospect => prospect.status === 'converted').length;
    
    console.log('Prospect to Lead conversion details:', {
      totalProspects,
      convertedProspects,
      allStatuses: prospects.map(p => p.status),
      rate: totalProspects === 0 ? 0 : Math.round((convertedProspects / totalProspects) * 100)
    });
    
    if (totalProspects === 0) return 0;
    return Math.round((convertedProspects / totalProspects) * 100);
  };

  const conversionStages = [
    { from: 'Prospect', to: 'Lead', rate: getProspectToLeadRate() },
    { from: 'Lead', to: 'Meeting', rate: getConversionRate('lead', 'meeting') },
    { from: 'Meeting', to: 'Negotiation', rate: getConversionRate('meeting', 'negotiation') },
    { from: 'Negotiation', to: 'Project Prep', rate: getConversionRate('negotiation', 'project_preparation') },
    { from: 'Project Prep', to: 'In Progress', rate: getConversionRate('project_preparation', 'in_progress') },
    { from: 'In Progress', to: 'To Invoice', rate: getConversionRate('in_progress', 'to_invoice') },
    { from: 'To Invoice', to: 'Invoiced', rate: getConversionRate('to_invoice', 'invoiced') },
    { from: 'Invoiced', to: 'Paid', rate: getConversionRate('invoiced', 'paid') }
  ];

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-8 gap-2">
        {conversionStages.map((stage, index) => (
          <div key={index} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg transition-all hover:bg-gray-100">
            <div className="text-sm font-medium text-gray-600 text-center mb-2">
              {stage.from} → {stage.to}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stage.rate}%
            </div>
            <Progress value={stage.rate} className="w-full bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
};