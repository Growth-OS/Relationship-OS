import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, UserPlus, Target } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateLeadForm } from "@/components/leads/CreateLeadForm";
import { CSVUploadDialog } from "@/components/leads/components/CSVUploadDialog";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { CampaignsList } from "@/components/campaigns/CampaignsList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lead, LeadSource } from "@/components/leads/types/lead";

const ITEMS_PER_PAGE = 10;

export const OutreachCampaigns = () => {
  const [createLeadDialogOpen, setCreateLeadDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: leadsData, isLoading: leadsLoading } = useQuery({
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

  const totalPages = Math.ceil((leadsData?.totalCount || 0) / ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col space-y-2 text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Outreach Campaigns</h1>
          <p className="text-muted-foreground">
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
                    toast.success("Leads uploaded successfully");
                  }} />
                </DialogContent>
              </Dialog>

              <Dialog open={createLeadDialogOpen} onOpenChange={setCreateLeadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-black hover:bg-black/90 text-white">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Lead
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New Lead</DialogTitle>
                  </DialogHeader>
                  <CreateLeadForm onSuccess={() => {
                    setCreateLeadDialogOpen(false);
                    toast.success("Lead added successfully");
                  }} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <LeadsTable 
                leads={leadsData?.leads || []}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isLoading={leadsLoading}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OutreachCampaigns;