import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

const ITEMS_PER_PAGE = 100;

const OutreachCampaigns = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  // Add a new query for campaign tasks statistics
  const { data: taskStats, isLoading: statsLoading } = useQuery({
    queryKey: ['campaign-task-stats'],
    queryFn: async () => {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('source', 'outreach');
      
      if (error) {
        console.error('Error fetching task stats:', error);
        throw error;
      }

      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.completed).length;
      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      return {
        total: totalTasks,
        completed: completedTasks,
        completionRate: Math.round(completionRate)
      };
    },
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { count, error: countError } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Error fetching count:', countError);
        throw countError;
      }

      const { data: leadsData, error: dataError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (dataError) {
        console.error('Error fetching leads:', dataError);
        throw dataError;
      }

      const typedLeads = leadsData?.map(lead => ({
        ...lead,
        source: (lead.source || 'other') as LeadSource
      })) || [];

      // Only calculate pages if we have more than ITEMS_PER_PAGE
      const totalPages = count ? Math.max(1, Math.ceil(count / ITEMS_PER_PAGE)) : 1;

      return {
        leads: typedLeads,
        totalCount: count || 0,
        totalPages: count && count > ITEMS_PER_PAGE ? totalPages : 1
      };
    },
    staleTime: 5000,
  });

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
      <div className="relative overflow-hidden rounded-lg bg-[#161e2c] border border-gray-800/40 shadow-sm">
        <div className="relative z-10 px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="text-left">
              <h1 className="text-2xl font-medium text-white">Outreach Campaigns</h1>
              <p className="text-sm text-gray-300 mt-1">
                Manage your outreach campaigns and leads
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Campaign Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Campaign Tasks</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Completion Rate</span>
              <span>{taskStats?.completionRate || 0}%</span>
            </div>
            <Progress 
              value={taskStats?.completionRate || 0} 
              className="h-2"
              indicatorClassName={`${
                (taskStats?.completionRate || 0) > 66
                  ? 'bg-green-500'
                  : (taskStats?.completionRate || 0) > 33
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
            />
            <div className="flex justify-between text-sm mt-2">
              <span>{taskStats?.completed || 0} completed</span>
              <span>{taskStats?.total || 0} total</span>
            </div>
          </div>
        </Card>
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
                onSelectAll={() => {
                  if (data?.leads) {
                    setSelectedLeadIds(prev => 
                      prev.length === data.leads.length ? [] : data.leads.map(lead => lead.id)
                    );
                  }
                }}
                leads={data?.leads}
              />
              <LeadsTable 
                leads={data?.leads || []}
                currentPage={currentPage}
                totalPages={data?.totalPages || 1}
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