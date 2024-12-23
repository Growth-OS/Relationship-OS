import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateDealForm } from "@/components/crm/CreateDealForm";
import { stages } from "@/components/crm/form-fields/StageSelect";

const CRM = () => {
  const [open, setOpen] = useState(false);

  const { data: deals = [], isLoading } = useQuery({
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
    <div className="space-y-6 animate-fade-in">
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Deal</DialogTitle>
            </DialogHeader>
            <CreateDealForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-8 gap-4">
        {stages.map((stage) => {
          const stageDeals = deals.filter(deal => deal.stage === stage.id);
          const totalValue = stageDeals.reduce((sum, deal) => sum + Number(deal.deal_value), 0);
          
          return (
            <div key={stage.id} className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-sm">{stage.label}</h3>
                <span className="text-xs text-gray-500">${totalValue.toLocaleString()}</span>
              </div>
              <div className="flex-1 space-y-2">
                {stageDeals.map((deal) => (
                  <Card key={deal.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                    <h4 className="font-medium mb-1">{deal.company_name}</h4>
                    <p className="text-sm text-gray-600 mb-2">${Number(deal.deal_value).toLocaleString()}</p>
                    {deal.contact_job_title && (
                      <p className="text-xs text-gray-500">{deal.contact_job_title}</p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CRM;