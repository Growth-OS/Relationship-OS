import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stages } from "@/components/crm/form-fields/StageSelect";
import { ArrowRight } from "lucide-react";

export const DealStageConversions = () => {
  const currentYear = new Date().getFullYear();
  const startOfYear = `${currentYear}-01-01`;
  const endOfYear = `${currentYear}-12-31`;

  const { data: deals = [] } = useQuery({
    queryKey: ['dealConversions', currentYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('stage, created_at')
        .gte('created_at', startOfYear)
        .lte('created_at', endOfYear)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log('Fetched deals:', data);
      return data;
    },
  });

  const { data: prospects = [] } = useQuery({
    queryKey: ['prospects', currentYear],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prospects')
        .select('status, created_at')
        .gte('created_at', startOfYear)
        .lte('created_at', endOfYear);
      
      if (error) throw error;
      console.log('Fetched prospects:', data); // Debug log
      return data;
    },
  });

  // Calculate conversion rates between stages
  const getConversionRate = (fromStage: string, toStage: string) => {
    // Count all deals that have reached or passed the 'fromStage'
    const fromCount = deals.filter(deal => {
      const stageIndex = stages.findIndex(s => s.id === deal.stage);
      const fromStageIndex = stages.findIndex(s => s.id === fromStage);
      return stageIndex >= fromStageIndex;
    }).length;

    // Count all deals that have reached or passed the 'toStage'
    const toCount = deals.filter(deal => {
      const stageIndex = stages.findIndex(s => s.id === deal.stage);
      const toStageIndex = stages.findIndex(s => s.id === toStage);
      return stageIndex >= toStageIndex;
    }).length;
    
    console.log(`Conversion ${fromStage} -> ${toStage}:`, { fromCount, toCount });
    
    if (fromCount === 0) return 0;
    return Math.round((toCount / fromCount) * 100);
  };

  // Calculate prospect to lead conversion rate
  const getProspectToLeadRate = () => {
    const totalProspects = prospects.length;
    const convertedProspects = prospects.filter(prospect => prospect.status === 'converted').length;
    
    console.log('Prospect to Lead conversion:', {
      totalProspects,
      convertedProspects,
      rate: totalProspects === 0 ? 0 : Math.round((convertedProspects / totalProspects) * 100)
    });
    
    if (totalProspects === 0) return 0;
    return Math.round((convertedProspects / totalProspects) * 100);
  };

  // Get consecutive stage pairs including prospect to lead
  const allConversions = [
    { from: { id: 'prospect', label: 'Prospect' }, to: { id: 'lead', label: 'Lead' } },
    ...stages.slice(0, -1).map((stage, index) => ({
      from: stage,
      to: stages[index + 1],
    }))
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Conversion Rates ({currentYear})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allConversions.map(({ from, to }) => {
            const conversionRate = from.id === 'prospect' 
              ? getProspectToLeadRate()
              : getConversionRate(from.id, to.id);
            
            return (
              <div key={`${from.id}-${to.id}`} className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-medium">{from.label}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{to.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all" 
                      style={{ width: `${conversionRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{conversionRate}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};