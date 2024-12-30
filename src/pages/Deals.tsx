import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateDealForm } from "@/components/crm/CreateDealForm";
import { DealHeader } from "@/components/crm/DealHeader";
import { DealBoard } from "@/components/crm/DealBoard";
import { Deal } from "@/integrations/supabase/types/deals";
import { toast } from "sonner";

const Deals = () => {
  const [open, setOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  const { data: deals = [], isLoading, error, refetch } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Not authenticated');
        throw new Error('Not authenticated');
      }

      console.log('Fetching deals for user:', user.id);
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('user_id', user.id)
        .order('last_activity_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching deals:', error);
        toast.error('Error loading deals');
        throw error;
      }

      console.log('Deals fetched:', data?.length || 0);
      return data || [];
    },
    retry: 1,
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading deals</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1EAEDB]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-[calc(100vh-4rem)] flex flex-col animate-fade-in">
      <DealHeader open={open} setOpen={setOpen} />
      <DealBoard deals={deals} onEdit={setEditingDeal} />

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