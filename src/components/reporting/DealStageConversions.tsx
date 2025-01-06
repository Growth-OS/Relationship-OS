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
        .select('stage')
        .gte('created_at', startOfYear)
        .lte('created_at', endOfYear)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Calculate conversion rates between stages
  const getConversionRate = (fromStage: string, toStage: string) => {
    const fromCount = deals.filter(deal => deal.stage === fromStage).length;
    const toCount = deals.filter(deal => deal.stage === toStage).length;
    
    if (fromCount === 0) return 0;
    return Math.round((toCount / fromCount) * 100);
  };

  // Get consecutive stage pairs
  const stagePairs = stages.slice(0, -1).map((stage, index) => ({
    from: stage,
    to: stages[index + 1],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Deal Stage Conversions ({currentYear})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stagePairs.map(({ from, to }) => {
            const conversionRate = getConversionRate(from.id, to.id);
            
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