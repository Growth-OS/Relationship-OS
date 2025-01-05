import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProspectsTable } from "@/components/prospects/ProspectsTable";
import { CreateProspectForm } from "@/components/prospects/CreateProspectForm";

const ITEMS_PER_PAGE = 10;

const Prospects = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['prospects', currentPage],
    queryFn: async () => {
      console.log('Fetching prospects for page:', currentPage);
      
      // First, get the total count
      const { count, error: countError } = await supabase
        .from('prospect_sequence_info')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Error fetching count:', countError);
        throw countError;
      }

      // Then get the paginated data
      const { data, error: dataError } = await supabase
        .from('prospect_sequence_info')
        .select('*')
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);
      
      if (dataError) {
        console.error('Error fetching prospects:', dataError);
        throw dataError;
      }
      
      console.log('Prospects fetched:', data);
      return {
        prospects: data || [],
        totalCount: count || 0,
      };
    },
  });

  const totalPages = Math.ceil((data?.totalCount || 0) / ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (error) {
    console.error('Query error:', error);
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">Error loading prospects. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prospects</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your potential leads
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-black/90 text-white">
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
              queryClient.invalidateQueries({ queryKey: ['prospects'] });
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <ProspectsTable 
          prospects={data?.prospects || []}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Prospects;