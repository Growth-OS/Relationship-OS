import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProspectsTable } from "@/components/prospects/ProspectsTable";
import { CreateProspectForm } from "@/components/prospects/CreateProspectForm";
import { ZapierWebhookInfo } from "@/components/prospects/ZapierWebhookInfo";

const Prospects = () => {
  const [open, setOpen] = useState(false);

  const { data: prospects = [], isLoading, refetch } = useQuery({
    queryKey: ['prospects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false });
      
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
          <h1 className="text-2xl font-bold text-primary mb-1">Prospects</h1>
          <p className="text-sm text-gray-600">Manage your potential leads</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Prospect
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Prospect</DialogTitle>
            </DialogHeader>
            <CreateProspectForm onSuccess={() => {
              setOpen(false);
              refetch();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <ProspectsTable prospects={prospects} onProspectUpdated={refetch} />
      
      <ZapierWebhookInfo />
    </div>
  );
};

export default Prospects;