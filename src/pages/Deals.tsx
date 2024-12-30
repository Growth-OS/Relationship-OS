import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateDealForm } from "@/components/crm/CreateDealForm";
import { stages } from "@/components/crm/form-fields/StageSelect";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
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

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      const { error } = await supabase
        .from('deals')
        .update({ stage: destination.droppableId })
        .eq('id', draggableId);

      if (error) {
        console.error('Error updating deal stage:', error);
        return;
      }

      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
        <div className="grid grid-cols-8 gap-3 flex-1 min-h-0 px-4 pb-4 overflow-x-auto">
          {stages.map((stage) => {
            const stageDeals = deals.filter(deal => deal.stage === stage.id);
            const totalValue = stageDeals.reduce((sum, deal) => sum + Number(deal.deal_value), 0);
            
            return (
              <div key={stage.id} className="flex flex-col min-h-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm min-w-[320px]">
                <div className="flex justify-between items-center p-3 border-b">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm">{stage.label}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[#E3F2FD] text-[#1EAEDB] font-medium">
                      {stageDeals.length}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[#1EAEDB]">
                    ${totalValue.toLocaleString()}
                  </span>
                </div>
                <Droppable droppableId={stage.id}>
                  {(provided) => (
                    <ScrollArea className="flex-1 p-2">
                      <div 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {stageDeals.map((deal, index) => (
                          <Draggable 
                            key={deal.id} 
                            draggableId={deal.id} 
                            index={index}
                          >
                            {(provided) => (
                              <Card 
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-3 hover:shadow-md transition-all duration-200 cursor-move group border-l-4 border-l-[#1EAEDB] hover:translate-x-1"
                                onClick={() => setEditingDeal(deal)}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium text-sm line-clamp-2">{deal.company_name}</h4>
                                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CreateTaskButton sourceId={deal.id} source="deals" variant="ghost" size="icon" />
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      className="h-8 w-8 hover:bg-[#E3F2FD] hover:text-[#1EAEDB]"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingDeal(deal);
                                      }}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <p className="text-sm font-medium text-[#1EAEDB] mb-2">
                                  ${Number(deal.deal_value).toLocaleString()}
                                </p>
                                {deal.contact_job_title && (
                                  <p className="text-xs text-muted-foreground mb-1">{deal.contact_job_title}</p>
                                )}
                                {deal.notes && (
                                  <p className="text-xs text-muted-foreground line-clamp-2">{deal.notes}</p>
                                )}
                                {deal.country && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <span>{deal.country_flag}</span>
                                    <span className="text-xs text-muted-foreground">{deal.country}</span>
                                  </div>
                                )}
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {stageDeals.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-muted-foreground">
                            <p>No deals in this stage</p>
                            <p className="text-xs mt-1">Drag deals here or create a new one</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  )}
                </Droppable>
              </div>
            );
          })}
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