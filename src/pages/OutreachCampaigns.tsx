import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Target, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { CreateLeadForm } from "@/components/leads/CreateLeadForm";
import { CSVUploadDialog } from "@/components/leads/components/CSVUploadDialog";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignsList } from "@/components/campaigns/CampaignsList";
import { Lead, LeadSource } from "@/components/leads/types/lead";
import { BulkActions } from "@/components/leads/components/BulkActions";

const ITEMS_PER_PAGE = 10;

const OutreachCampaigns = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['leads', currentPage],
    queryFn: async () => {
      const countQuery = supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

      const { count, error: countError } = await countQuery;
      
      if (countError) {
        console.error('Error fetching count:', countError);
        throw countError;
      }

      const { data: leadsData, error: dataError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);
      
      if (dataError) {
        console.error('Error fetching leads:', dataError);
        throw dataError;
      }

      const typedLeads = leadsData?.map(lead => ({
        ...lead,
        source: (lead.source || 'other') as LeadSource
      })) || [];

      return {
        leads: typedLeads,
        totalCount: count || 0,
      };
    },
    staleTime: 5000,
  });

  const totalPages = Math.ceil((data?.totalCount || 0) / ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSelectAll = () => {
    if (data?.leads) {
      setSelectedLeadIds(prev => 
        prev.length === data.leads.length ? [] : data.leads.map(lead => lead.id)
      );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Outreach Campaigns</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your outreach campaigns and leads
          </p>
        </div>
      </div>

      <Tabs defaultValue="campaigns">
        <div className="container mx-auto px-6">
          <TabsList>
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Leads
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="campaigns">
          <div className="container mx-auto px-6">
            <CampaignsList />
          </div>
        </TabsContent>

        <TabsContent value="leads">
          <div className="space-y-4 container mx-auto px-6">
            <div className="flex justify-end gap-4">
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload CSV
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Upload Leads CSV</DialogTitle>
                  </DialogHeader>
                  <CSVUploadDialog onSuccess={() => {
                    setUploadDialogOpen(false);
                    refetch();
                    toast.success("Leads uploaded successfully");
                  }} />
                </DialogContent>
              </Dialog>

              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-black hover:bg-black/90 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lead
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Lead</DialogTitle>
                  </DialogHeader>
                  <CreateLeadForm onSuccess={() => {
                    setCreateDialogOpen(false);
                    refetch();
                    toast.success("Lead added successfully");
                  }} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <BulkActions 
                selectedIds={selectedLeadIds}
                onSelectAll={handleSelectAll}
              />
              <LeadsTable 
                leads={data?.leads || []}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={isLoading}
                selectedIds={selectedLeadIds}
                onSelectChange={setSelectedLeadIds}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OutreachCampaigns;