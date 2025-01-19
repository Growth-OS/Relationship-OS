import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Plane } from "lucide-react";
import { format, differenceInDays, startOfQuarter, endOfQuarter } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const DashboardTravelWidget = () => {
  const navigate = useNavigate();
  const currentDate = new Date();

  const { data: travels, isLoading } = useQuery({
    queryKey: ["quarterly-travels"],
    queryFn: async () => {
      const { data: travels, error } = await supabase
        .from("travels")
        .select("*")
        .eq("status", "upcoming")
        .gte("departure_date", currentDate.toISOString())
        .lte("departure_date", endOfQuarter(currentDate).toISOString())
        .order("departure_date", { ascending: true });

      if (error) throw error;
      return travels;
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-24 bg-gray-100 rounded-lg" />
      </Card>
    );
  }

  if (!travels?.length) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p>No upcoming travels this quarter</p>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer bg-gradient-to-br from-white to-gray-50"
      onClick={() => navigate("/dashboard/travels")}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Quarterly Travels</h3>
          <span className="text-sm text-muted-foreground">
            {travels.length} {travels.length === 1 ? 'journey' : 'journeys'} planned
          </span>
        </div>

        <div className="space-y-4">
          {travels.map((travel) => {
            const daysUntilDeparture = differenceInDays(
              new Date(travel.departure_date),
              currentDate
            );

            return (
              <TooltipProvider key={travel.id}>
                <Tooltip>
                  <TooltipTrigger className="w-full">
                    <div className="flex items-center justify-between gap-4 py-2 border-t first:border-t-0">
                      <div className="flex flex-col items-center">
                        <div className="text-2xl">{travel.origin_country_flag}</div>
                        <span className="text-xs font-medium">{travel.origin_country}</span>
                      </div>
                      
                      <div className="flex-1 flex items-center justify-center gap-2">
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-200 via-primary/20 to-gray-200" />
                        <Plane className="w-4 h-4 text-primary rotate-0" />
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-200 via-primary/20 to-gray-200" />
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="text-2xl">{travel.destination_country_flag}</div>
                        <span className="text-xs font-medium">{travel.destination_country}</span>
                      </div>

                      <div className="min-w-24 text-right">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(travel.departure_date), "d MMM")}
                        </span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm space-y-1">
                      <p>In {daysUntilDeparture} days</p>
                      {travel.company_name && (
                        <p>Visiting: {travel.company_name}</p>
                      )}
                      {travel.notes && <p>{travel.notes}</p>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>
    </Card>
  );
};