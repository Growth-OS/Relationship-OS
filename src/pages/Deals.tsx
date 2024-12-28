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
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 h-[calc(100vh-4rem)] flex flex-col animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">CRM Pipeline</h1>
          <p className="text-sm text-gray-600">Manage your deals and opportunities</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
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

      <div className="grid grid-cols-8 gap-4 flex-1 min-h-0">
        {stages.map((stage) => {
          const stageDeals = deals.filter(deal => deal.stage === stage.id);
          const totalValue = stageDeals.reduce((sum, deal) => sum + Number(deal.deal_value), 0);
          
          return (
            <div key={stage.id} className="flex flex-col min-h-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-sm">{stage.label}</h3>
                <span className="text-xs text-gray-500">${totalValue.toLocaleString()}</span>
              </div>
              <ScrollArea className="flex-1">
                <div className="space-y-2 pr-2">
                  {stageDeals.map((deal) => (
                    <Card 
                      key={deal.id} 
                      className="p-3 hover:shadow-md transition-shadow cursor-pointer group"
                      onClick={() => setEditingDeal(deal)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{deal.company_name}</h4>
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <CreateTaskButton sourceId={deal.id} source="deals" variant="ghost" size="icon" />
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingDeal(deal);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">${Number(deal.deal_value).toLocaleString()}</p>
                      {deal.contact_job_title && (
                        <p className="text-xs text-gray-500 mb-1">{deal.contact_job_title}</p>
                      )}
                      {deal.notes && (
                        <p className="text-xs text-gray-500 line-clamp-3">{deal.notes}</p>
                      )}
                      {deal.country && (
                        <div className="flex items-center gap-1 mt-2">
                          <span>{deal.country_flag}</span>
                          <span className="text-xs text-gray-500">{deal.country}</span>
                        </div>
                      )}
                    </Card>
                  ))}
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