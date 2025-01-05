import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CreateTravelForm } from "@/components/travels/CreateTravelForm";
import { TravelsList } from "@/components/travels/TravelsList";
import { supabase } from "@/integrations/supabase/client";

export default function Travels() {
  const [travels, setTravels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTravels();
  }, []);

  const fetchTravels = async () => {
    try {
      const { data, error } = await supabase
        .from("travels")
        .select("*")
        .order("departure_date", { ascending: true });

      if (error) throw error;
      setTravels(data || []);
    } catch (error) {
      console.error("Error fetching travels:", error);
      toast({
        title: "Error",
        description: "Failed to fetch travels",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Travels</h1>
      </div>
      
      <CreateTravelForm onSuccess={fetchTravels} />
      
      <TravelsList travels={travels} isLoading={isLoading} onTravelUpdated={fetchTravels} />
    </div>
  );
}