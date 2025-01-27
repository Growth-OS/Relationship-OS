import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CreateTravelForm } from "@/components/travels/CreateTravelForm";
import { TravelsList } from "@/components/travels/TravelsList";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Travels() {
  const [travels, setTravels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTravels();
  }, []);

  const fetchTravels = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("travels")
        .select("*")
        .eq('user_id', session.user.id)
        .order('status', { ascending: true })
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
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-lg bg-[#161e2c] border border-gray-800/40 shadow-sm">
        <div className="relative z-10 px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-left">
              <h1 className="text-2xl font-medium text-white">Travels</h1>
              <p className="text-sm text-gray-300 mt-1">
                Manage your upcoming and past travels
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="secondary"
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Travel
                </Button>
              </DialogTrigger>
              <DialogContent>
                <CreateTravelForm onSuccess={fetchTravels} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      <TravelsList 
        travels={travels} 
        isLoading={isLoading} 
        onTravelUpdated={fetchTravels} 
      />
    </div>
  );
}