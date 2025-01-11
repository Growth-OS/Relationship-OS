import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Plane, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { format, differenceInDays } from "date-fns";

interface Travel {
  id: string;
  departure_date: string;
  return_date: string;
  origin_country: string;
  origin_country_flag: string;
  destination_country: string;
  destination_country_flag: string;
  company_name: string | null;
  notes: string | null;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export const DashboardTravelWidget = () => {
  const navigate = useNavigate();

  const { data: nextTravel } = useQuery({
    queryKey: ["next-travel"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("travels")
        .select("*")
        .eq("status", "upcoming")
        .order("departure_date", { ascending: true })
        .limit(1)
        .single();

      if (error) throw error;
      return data as Travel;
    },
  });

  if (!nextTravel) return null;

  const daysUntilDeparture = differenceInDays(
    new Date(nextTravel.departure_date),
    new Date()
  );

  return (
    <Card 
      className="p-6 bg-gray-50 dark:bg-gray-800 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => navigate("/dashboard/travels")}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Next Journey</h3>
          {daysUntilDeparture > 0 && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {daysUntilDeparture} {daysUntilDeparture === 1 ? 'Day' : 'Days'} to Departure
            </span>
          )}
        </div>

        <div className="relative">
          {/* Journey Timeline */}
          <div className="flex items-center justify-between relative">
            {/* Dotted line background */}
            <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-gray-300 dark:border-gray-600 -z-10" />
            
            {/* Origin */}
            <div className="flex flex-col items-center space-y-2 bg-gray-50 dark:bg-gray-800 pr-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{nextTravel.origin_country_flag}</span>
                <span className="font-medium">{nextTravel.origin_country}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(nextTravel.departure_date), 'dd MMM yyyy')}</span>
              </div>
            </div>

            {/* Airplane */}
            <div className="flex-shrink-0 z-10 bg-gray-50 dark:bg-gray-800 px-4">
              <Plane className="w-6 h-6 text-blue-500 dark:text-blue-400 transform -rotate-45 group-hover:translate-x-2 transition-transform" />
            </div>

            {/* Destination */}
            <div className="flex flex-col items-center space-y-2 bg-gray-50 dark:bg-gray-800 pl-2">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{nextTravel.destination_country_flag}</span>
                <span className="font-medium">{nextTravel.destination_country}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(nextTravel.return_date), 'dd MMM yyyy')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        {nextTravel.company_name && (
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center mt-4">
            Purpose: {nextTravel.company_name}
          </div>
        )}
      </div>
    </Card>
  );
};