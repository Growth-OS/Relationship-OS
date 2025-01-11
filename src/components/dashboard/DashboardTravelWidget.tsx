import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Plane } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const DashboardTravelWidget = () => {
  const navigate = useNavigate();

  const { data: nextTravel, isLoading } = useQuery({
    queryKey: ["next-travel"],
    queryFn: async () => {
      const { data: travels, error } = await supabase
        .from("travels")
        .select("*")
        .eq("status", "upcoming")
        .gte("departure_date", new Date().toISOString())
        .order("departure_date", { ascending: true })
        .limit(1)
        .single();

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

  if (!nextTravel) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <p>No upcoming travels</p>
        </div>
      </Card>
    );
  }

  const daysUntilDeparture = differenceInDays(
    new Date(nextTravel.departure_date),
    new Date()
  );

  return (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer bg-gradient-to-br from-white to-gray-50"
      onClick={() => navigate("/dashboard/travels")}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Next Journey</h3>
          <span className="text-sm text-muted-foreground">
            {daysUntilDeparture} days to departure
          </span>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center justify-between gap-4 py-4">
                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-2">{nextTravel.origin_country_flag}</div>
                  <span className="text-sm font-medium text-center">{nextTravel.origin_country}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(nextTravel.departure_date), "d MMM yyyy")}
                  </span>
                </div>
                
                <div className="flex-1 flex items-center justify-center gap-2">
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-200 via-primary/20 to-gray-200" />
                  <Plane className="w-5 h-5 text-primary rotate-0 animate-pulse" />
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-200 via-primary/20 to-gray-200" />
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-3xl mb-2">{nextTravel.destination_country_flag}</div>
                  <span className="text-sm font-medium text-center">{nextTravel.destination_country}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(nextTravel.return_date), "d MMM yyyy")}
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                {nextTravel.company_name && (
                  <p>Visiting: {nextTravel.company_name}</p>
                )}
                {nextTravel.notes && <p>{nextTravel.notes}</p>}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
};