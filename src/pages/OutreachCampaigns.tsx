import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { List, Target, Upload, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateCampaignDialog } from "@/components/prospects/components/sequence-form/CreateCampaignDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateLeadForm } from "@/components/leads/CreateLeadForm";
import { CSVUploadDialog } from "@/components/leads/components/CSVUploadDialog";
import { toast } from "sonner";
import { Lead, LeadSource } from "@/components/leads/types/lead";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ITEMS_PER_PAGE = 10;

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  status: string;
  created_at: string;
}

interface CampaignStep {
  id: string;
  step_type: string;
  delay_days: number;
  message_template: string | null;
  sequence_order: number;
}

const OutreachCampaigns = () => {
  const [createLeadDialogOpen, setCreateLeadDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [viewStepsOpen, setViewStepsOpen] = useState(false);
  
  const { data: campaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('outreach_campaigns')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error("Error fetching campaigns");
        throw error;
      }
      
      return data as Campaign[];
    },
  });

  const { data: campaignSteps, isLoading: stepsLoading } = useQuery({
    queryKey: ['campaign_steps', selectedCampaignId],
    enabled: !!selectedCampaignId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaign_steps')
        .select('*')
        .eq('campaign_id', selectedCampaignId)
        .order('sequence_order', { ascending: true });
      
      if (error) {
        toast.error("Error fetching campaign steps");
        throw error;
      }
      
      return data as CampaignStep[];
    },
  });

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

      // Cast the source field to LeadSource type
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

  const handleViewSteps = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setViewStepsOpen(true);
  };

  if (campaignsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Outreach Campaigns</h1>
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

        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-end">
            <CreateCampaignDialog />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns?.map((campaign) => (
              <Card key={campaign.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    {campaign.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {campaign.description || "No description provided"}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewSteps(campaign.id)}
                    >
                      <List className="h-4 w-4 mr-2" />
                      View Steps
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Dialog open={viewStepsOpen} onOpenChange={setViewStepsOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Campaign Steps</DialogTitle>
              </DialogHeader>
              {stepsLoading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {campaignSteps?.map((step, index) => (
                    <AccordionItem key={step.id} value={step.id}>
                      <AccordionTrigger>
                        Step {index + 1} - {step.step_type} ({step.delay_days} days)
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Message Template:</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {step.message_template || "No message template"}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </DialogContent>
          </Dialog>

          {campaigns?.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-xl font-semibold mb-2">No campaigns yet</p>
                <p className="text-muted-foreground mb-4">
                  Create your first outreach campaign to get started
                </p>
                <CreateCampaignDialog />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="leads">
          <div className="space-y-4">
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
