import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateDealForm } from "@/components/crm/CreateDealForm";
import { stages } from "@/components/crm/form-fields/StageSelect";
import { DragDropContext } from "@hello-pangea/dnd";
import { toast } from "sonner";
import { DealStageColumn } from "@/components/crm/DealStageColumn";

const Deals = () => {
  const [open, setOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: deals = [], isLoading, error, refetch } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('last_activity_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching deals:', error);
        throw error;
      }

      return data || [];
    },
    retry: 1,
  });

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      try {
        const { error } = await supabase
          .from('deals')
          .update({ 
            stage: destination.droppableId,
            last_activity_date: new Date().toISOString()
          })
          .eq('id', draggableId);

        if (error) throw error;
        
        // Invalidate both deals and reporting queries
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['deals'] }),
          queryClient.invalidateQueries({ queryKey: ['dealConversions'] })
        ]);
        
        toast.success('Deal stage updated successfully');
      } catch (error) {
        console.error('Error updating deal stage:', error);
        toast.error('Failed to update deal stage');
      }
    }
  };

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
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#33C3F0] to-[#1EAEDB] bg-clip-text text-transparent">
            CRM Pipeline
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your deals and opportunities
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1EAEDB] hover:bg-[#0FA0CE] transition-colors">
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

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid auto-cols-[320px] grid-flow-col gap-3 overflow-x-auto pb-4 px-4">
          {stages.map((stage) => (
            <DealStageColumn
              key={stage.id}
              stage={stage}
              deals={deals}
              onEdit={setEditingDeal}
            />
          ))}
        </div>
      </DragDropContext>

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