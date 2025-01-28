import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Plane } from "lucide-react";

export const UpcomingTravelReport = () => {
  const { data: travels = [] } = useQuery({
    queryKey: ['upcoming-travels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('travels')
        .select('*')
        .gte('departure_date', new Date().toISOString())
        .order('departure_date', { ascending: true })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Upcoming Travel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {travels.map((travel) => (
            <div key={travel.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{travel.origin_country_flag}</span>
                  <Plane className="h-4 w-4 rotate-90" />
                  <span className="text-lg">{travel.destination_country_flag}</span>
                </div>
                <div className="ml-2">
                  <p className="font-medium">{travel.destination_country}</p>
                  {travel.company_name && (
                    <p className="text-sm text-muted-foreground">{travel.company_name}</p>
                  )}
                </div>
              </div>
              <div className="text-sm text-right">
                <p className="font-medium">{format(new Date(travel.departure_date), 'MMM d')}</p>
                <p className="text-muted-foreground">{format(new Date(travel.return_date), 'MMM d')}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};