import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProspectsTable } from "@/components/prospects/ProspectsTable";
import { CreateProspectForm } from "@/components/prospects/CreateProspectForm";
import { CSVUploadDialog } from "@/components/prospects/CSVUploadDialog";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const ProspectsManagement = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConverted, setShowConverted] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['prospects', currentPage, showConverted],
    queryFn: async () => {
      console.log('Fetching prospects for page:', currentPage, 'showConverted:', showConverted);
      
      const countQuery = supabase
        .from('prospect_sequence_info')
        .select('*', { count: 'exact', head: true });

      if (showConverted) {
        countQuery.eq('status', 'converted');
      } else {
        countQuery.neq('status', 'converted');
      }

      const { count, error: countError } = await countQuery;
      
      if (countError) {
        console.error('Error fetching count:', countError);
        throw countError;
      }

      const dataQuery = supabase
        .from('prospect_sequence_info')
        .select('*')
        .order('created_at', { ascending: false });

      if (showConverted) {
        dataQuery.eq('status', 'converted');
      } else {
        dataQuery.neq('status', 'converted');
      }

      const { data: prospectsData, error: dataError } = await dataQuery
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);
      
      if (dataError) {
        console.error('Error fetching prospects:', dataError);
        throw dataError;
      }
      
      return {
        prospects: prospectsData || [],
        totalCount: count || 0,
      };
    },
    staleTime: 5000,
  });

  const totalPages = Math.ceil((data?.totalCount || 0) / ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prospects Management</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Upload, create and manage your prospects
          </p>
        </div>
        <div className="flex gap-4">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Upload Prospects CSV</DialogTitle>
              </DialogHeader>
              <CSVUploadDialog onSuccess={() => {
                setUploadDialogOpen(false);
                refetch();
                toast.success("Prospects uploaded successfully");
              }} />
            </DialogContent>
          </Dialog>

          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
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
                setCreateDialogOpen(false);
                refetch();
                toast.success("Prospect added successfully");
              }} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <ProspectsTable 
          prospects={data?.prospects || []}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          showConverted={showConverted}
          onShowConvertedChange={setShowConverted}
        />
      </div>
    </div>
  );
};

export default ProspectsManagement;