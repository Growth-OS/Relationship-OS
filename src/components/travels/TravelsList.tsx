import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TravelGroup } from "./components/TravelGroup";
import { Travel, TravelStatus } from "./types";

interface TravelsListProps {
  travels: Travel[];
  isLoading: boolean;
  onTravelUpdated: () => void;
}

export const TravelsList = ({ travels, isLoading, onTravelUpdated }: TravelsListProps) => {
  const handleStatusChange = async (travelId: string, newStatus: TravelStatus) => {
    try {
      const { error } = await supabase
        .from('travels')
        .update({ status: newStatus })
        .eq('id', travelId);

      if (error) throw error;
      
      toast.success('Travel status updated');
      onTravelUpdated();
    } catch (error) {
      console.error('Error updating travel status:', error);
      toast.error('Failed to update travel status');
    }
  };

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

  // Group travels by status
  const groupedTravels = travels.reduce((acc, travel) => {
    const status = travel.status || 'upcoming';
    if (!acc[status]) acc[status] = [];
    acc[status].push(travel);
    return acc;
  }, {} as Record<TravelStatus, Travel[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedTravels).map(([status, statusTravels]) => (
        <TravelGroup
          key={status}
          status={status}
          travels={statusTravels}
          onTravelUpdated={onTravelUpdated}
        />
      ))}
    </div>
  );
};