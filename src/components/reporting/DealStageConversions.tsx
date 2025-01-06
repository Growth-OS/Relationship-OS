import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      // Format dates for Supabase query in YYYY-MM-DD format
      const start = format(startOfYear(new Date()), 'yyyy-MM-dd');
      const end = format(endOfYear(new Date()), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .gte('created_at', start)
        .lte('created_at', end);
      
      if (error) throw error;
      
      // Detailed logging for prospect data
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
    const stages = ['lead', 'meeting', 'proposal', 'negotiation', 'won'];
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
    
    // Detailed logging for conversion calculation
    console.log('Prospect to Lead conversion details:', {
      totalProspects,
      convertedProspects,
      allStatuses: prospects.map(p => p.status),
      rate: totalProspects === 0 ? 0 : Math.round((convertedProspects / totalProspects) * 100)
    });
    
    if (totalProspects === 0) return 0;
    return Math.round((convertedProspects / totalProspects) * 100);
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Prospect → Lead</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getProspectToLeadRate()}%</div>
          <Progress value={getProspectToLeadRate()} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Lead → Meeting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getConversionRate('lead', 'meeting')}%</div>
          <Progress value={getConversionRate('lead', 'meeting')} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Meeting → Proposal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getConversionRate('meeting', 'proposal')}%</div>
          <Progress value={getConversionRate('meeting', 'proposal')} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Proposal → Won</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getConversionRate('proposal', 'won')}%</div>
          <Progress value={getConversionRate('proposal', 'won')} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};