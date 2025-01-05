import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Plane, Building2, MapPin, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TravelsListProps {
  travels: any[];
  isLoading: boolean;
  onTravelUpdated: () => void;
}

export const TravelsList = ({ travels, isLoading, onTravelUpdated }: TravelsListProps) => {
  const handleStatusChange = async (travelId: string, newStatus: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedTravels).map(([status, statusTravels]) => (
        <div key={status} className="space-y-4">
          <h2 className="text-lg font-semibold capitalize">{status.replace('_', ' ')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statusTravels.map((travel) => (
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
                    <Select
                      value={travel.status || 'upcoming'}
                      onValueChange={(value) => handleStatusChange(travel.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="archived">Archive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Badge */}
                  <Badge className={`w-fit ${getStatusColor(travel.status)}`}>
                    {travel.status?.replace('_', ' ') || 'Upcoming'}
                  </Badge>

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

                  {/* Company Name */}
                  {travel.company_name && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t">
                      <Building2 className="w-4 h-4" />
                      <span>{travel.company_name}</span>
                    </div>
                  )}

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
        </div>
      ))}
    </div>
  );
};