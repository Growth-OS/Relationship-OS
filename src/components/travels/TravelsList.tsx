import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Plane, Flag } from "lucide-react";

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
    <div className="space-y-4">
      {travels.map((travel) => (
        <Card key={travel.id} className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="text-2xl">{travel.origin_country_flag}</div>
                <Flag className="w-4 h-4 text-gray-400 my-2" />
                <div className="text-2xl">{travel.destination_country_flag}</div>
              </div>
              
              <div>
                <h3 className="font-semibold">
                  {travel.origin_country} to {travel.destination_country}
                </h3>
                {travel.company_name && (
                  <p className="text-sm text-gray-600">
                    Working with: {travel.company_name}
                  </p>
                )}
                {travel.notes && (
                  <p className="text-sm text-gray-500 mt-2">{travel.notes}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4" />
                <span className="text-sm">
                  {format(new Date(travel.departure_date), "MMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 rotate-180" />
                <span className="text-sm">
                  {format(new Date(travel.return_date), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};