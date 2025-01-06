import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfYear, endOfYear, format } from 'date-fns';
import { Progress } from "@/components/ui/progress";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const getConversionTrend = (rate: number) => {
    if (rate >= 70) return { icon: TrendingUp, color: 'text-green-500' };
    if (rate >= 40) return { icon: TrendingUp, color: 'text-yellow-500' };
    return { icon: TrendingDown, color: 'text-red-500' };
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
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Pipeline Conversion Rates</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>High (≥70%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medium (≥40%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Low (&lt;40%)</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
        <div className="relative z-10 flex justify-between items-center gap-4 overflow-x-auto pb-4">
          {conversionStages.map((stage, index) => {
            const trend = getConversionTrend(stage.rate);
            const TrendIcon = trend.icon;
            
            return (
              <div key={index} className="flex items-center min-w-fit">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col items-center gap-2 min-w-[140px]">
                    <div className="text-sm font-medium text-gray-600">{stage.from}</div>
                    <div className="flex items-center gap-2">
                      <div className={cn("text-2xl font-bold", trend.color)}>
                        {stage.rate}%
                      </div>
                      <TrendIcon className={cn("w-5 h-5", trend.color)} />
                    </div>
                    <Progress 
                      value={stage.rate} 
                      className="w-full h-1.5" 
                      indicatorClassName={cn(
                        stage.rate >= 70 ? "bg-green-500" :
                        stage.rate >= 40 ? "bg-yellow-500" :
                        "bg-red-500"
                      )}
                    />
                  </div>
                </div>
                {index < conversionStages.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-gray-400 mx-2 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
