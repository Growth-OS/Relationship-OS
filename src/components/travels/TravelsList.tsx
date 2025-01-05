import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Plane, Flag, Building2, MapPin } from "lucide-react";

interface TravelsListProps {
  travels: any[];
  isLoading: boolean;
  onTravelUpdated: () => void;
}

export const TravelsList = ({ travels, isLoading, onTravelUpdated }: TravelsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse bg-gray-100" />
        ))}
      </div>
    );
  }

  if (travels.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500">
        No travels found. Add your first travel above.
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {travels.map((travel) => (
        <Card 
          key={travel.id} 
          className="p-6 hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-white to-gray-50"
        >
          <div className="flex flex-col gap-4">
            {/* Journey Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <h3 className="font-semibold">Journey Details</h3>
              </div>
              {travel.company_name && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="w-4 h-4" />
                  <span>{travel.company_name}</span>
                </div>
              )}
            </div>

            {/* Journey Path Visualization */}
            <div className="flex items-center justify-between gap-4 py-4">
              <div className="flex flex-col items-center">
                <div className="text-3xl mb-2">{travel.origin_country_flag}</div>
                <span className="text-sm font-medium text-center">{travel.origin_country}</span>
              </div>
              
              <div className="flex-1 flex items-center justify-center gap-2">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-200 via-primary/20 to-gray-200" />
                <Plane className="w-5 h-5 text-primary rotate-0 animate-pulse" />
                <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-200 via-primary/20 to-gray-200" />
              </div>

              <div className="flex flex-col items-center">
                <div className="text-3xl mb-2">{travel.destination_country_flag}</div>
                <span className="text-sm font-medium text-center">{travel.destination_country}</span>
              </div>
            </div>

            {/* Dates */}
            <div className="flex justify-between text-sm text-gray-600 pt-2 border-t">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 rotate-45" />
                <span>{format(new Date(travel.departure_date), "MMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 -rotate-45" />
                <span>{format(new Date(travel.return_date), "MMM d, yyyy")}</span>
              </div>
            </div>

            {/* Notes */}
            {travel.notes && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-sm text-gray-500">{travel.notes}</p>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};