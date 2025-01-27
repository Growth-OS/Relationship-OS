import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProspectsTable } from "@/components/prospects/table/ProspectsTable";
import { CreateProspectForm } from "@/components/prospects/CreateProspectForm";
import { CSVUploadDialog } from "@/components/prospects/CSVUploadDialog";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

const Prospects = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConverted, setShowConverted] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['prospects', currentPage, showConverted],
    queryFn: async () => {
      const countQuery = supabase
        .from('prospects')
        .select('*', { count: 'exact', head: true });

      if (showConverted) {
        countQuery.eq('is_converted_to_deal', true);
      } else {
        countQuery.eq('is_converted_to_deal', false);
      }

      const { count, error: countError } = await countQuery;
      
      if (countError) {
        console.error('Error fetching count:', countError);
        throw countError;
      }

      const dataQuery = supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false });

      if (showConverted) {
        dataQuery.eq('is_converted_to_deal', true);
      } else {
        dataQuery.eq('is_converted_to_deal', false);
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
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-background border border-purple-200/10 shadow-sm">
        <div className="relative z-10 px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Prospects</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage and track your business prospects
              </p>
            </div>
            <div className="flex gap-3">
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-background hover:bg-purple-500/5">
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
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">
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
        </div>
      </div>

      <div className="bg-background rounded-lg border shadow-sm">
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

export default Prospects;