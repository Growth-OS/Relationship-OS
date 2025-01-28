import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";

export const DealProgressReport = () => {
  const { data: deals = [] } = useQuery({
    queryKey: ['deals-progress'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('last_activity_date', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  const stageProgress = {
    'lead': 20,
    'meeting': 40,
    'negotiation': 60,
    'project_preparation': 80,
    'in_progress': 90,
    'to_invoice': 95,
    'invoiced': 100,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recent Deals Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deals.map((deal) => (
            <div key={deal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{deal.company_name}</span>
                <span className="text-sm text-muted-foreground">€{deal.deal_value}</span>
              </div>
              <Progress value={stageProgress[deal.stage]} className="h-2" />
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Lead</span>
                <ArrowRight className="h-4 w-4" />
                <span>Paid</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};