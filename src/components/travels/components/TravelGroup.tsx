import { Card } from "@/components/ui/card";
import { TravelCard } from "./TravelCard";
import { Travel } from "../types";

interface TravelGroupProps {
  status: string;
  travels: Travel[];
  onTravelUpdated: () => void;
}

export const TravelGroup = ({ status, travels, onTravelUpdated }: TravelGroupProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold capitalize">{status.replace('_', ' ')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {travels.map((travel) => (
          <Card 
            key={travel.id} 
            className="p-6 hover:shadow-lg transition-shadow duration-200 bg-gradient-to-br from-white to-gray-50"
          >
            <TravelCard travel={travel} onTravelUpdated={onTravelUpdated} />
          </Card>
        ))}
      </div>
    </div>
  );
};