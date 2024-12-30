import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateDealForm } from "@/components/crm/CreateDealForm";
import { stages } from "@/components/crm/form-fields/StageSelect";
import { DealFormData } from "@/components/crm/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateTaskButton } from "@/components/tasks/CreateTaskButton";

const Deals = () => {
  const [open, setOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<any>(null);

  const { data: deals = [], isLoading, refetch } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('last_activity_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col animate-fade-in">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] bg-clip-text text-transparent">
            CRM Pipeline
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your deals and opportunities
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#9b87f5] hover:bg-[#7E69AB] transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Add Deal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Deal</DialogTitle>
            </DialogHeader>
            <CreateDealForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-8 gap-4 flex-1 min-h-0 px-6">
        {stages.map((stage) => {
          const stageDeals = deals.filter(deal => deal.stage === stage.id);
          const totalValue = stageDeals.reduce((sum, deal) => sum + Number(deal.deal_value), 0);
          
          return (
            <div key={stage.id} className="flex flex-col min-h-0 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm">{stage.label}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#E5DEFF] text-[#7E69AB] font-medium">
                    {stageDeals.length}
                  </span>
                </div>
                <span className="text-xs font-medium text-[#7E69AB]">
                  ${totalValue.toLocaleString()}
                </span>
              </div>
              <ScrollArea className="flex-1">
                <div className="space-y-3 pr-2">
                  {stageDeals.map((deal) => (
                    <Card 
                      key={deal.id} 
                      className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer group border-l-4 border-l-[#9b87f5] hover:translate-x-1"
                      onClick={() => setEditingDeal(deal)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{deal.company_name}</h4>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <CreateTaskButton sourceId={deal.id} source="deals" variant="ghost" size="icon" />
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 hover:bg-[#E5DEFF] hover:text-[#7E69AB]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingDeal(deal);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-[#7E69AB] mb-2">
                        ${Number(deal.deal_value).toLocaleString()}
                      </p>
                      {deal.contact_job_title && (
                        <p className="text-xs text-muted-foreground mb-1">{deal.contact_job_title}</p>
                      )}
                      {deal.notes && (
                        <p className="text-xs text-muted-foreground line-clamp-3">{deal.notes}</p>
                      )}
                      {deal.country && (
                        <div className="flex items-center gap-1 mt-2">
                          <span>{deal.country_flag}</span>
                          <span className="text-xs text-muted-foreground">{deal.country}</span>
                        </div>
                      )}
                    </Card>
                  ))}
                  {stageDeals.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-muted-foreground">
                      <p>No deals in this stage</p>
                      <p className="text-xs mt-1">Drag deals here or create a new one</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>

      {editingDeal && (
        <Dialog open={!!editingDeal} onOpenChange={() => setEditingDeal(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Deal</DialogTitle>
            </DialogHeader>
            <CreateDealForm 
              onSuccess={() => {
                setEditingDeal(null);
                refetch();
              }} 
              initialData={editingDeal}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Deals;