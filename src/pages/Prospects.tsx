import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProspectsTable } from "@/components/prospects/ProspectsTable";
import { CreateProspectForm } from "@/components/prospects/CreateProspectForm";

const Prospects = () => {
  const [open, setOpen] = useState(false);

  const { data: prospects = [], isLoading, error } = useQuery({
    queryKey: ['prospects'],
    queryFn: async () => {
      console.log('Fetching prospects...');
      const { data, error } = await supabase
        .from('prospect_sequence_info')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching prospects:', error);
        throw error;
      }
      
      console.log('Prospects fetched:', data);
      return data;
    },
  });

  if (error) {
    console.error('Query error:', error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">Error loading prospects. Please try again.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prospects</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your potential leads
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Prospect
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Prospect</DialogTitle>
            </DialogHeader>
            <CreateProspectForm onSuccess={() => {
              setOpen(false);
              // Invalidate and refetch prospects query
              queryClient.invalidateQueries({ queryKey: ['prospects'] });
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <ProspectsTable prospects={prospects} onProspectUpdated={() => {
          // Invalidate and refetch prospects query
          queryClient.invalidateQueries({ queryKey: ['prospects'] });
        }} />
      </div>
    </div>
  );
};

export default Prospects;