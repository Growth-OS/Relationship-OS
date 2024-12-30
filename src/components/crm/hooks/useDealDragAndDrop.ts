import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Deal, DealStage } from "@/integrations/supabase/types/deals";
import { DropResult } from "@hello-pangea/dnd";

export const useDealDragAndDrop = () => {
  const queryClient = useQueryClient();

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      try {
        const { error } = await supabase
          .from('deals')
          .update({ 
            stage: destination.droppableId as DealStage,
            last_activity_date: new Date().toISOString()
          })
          .eq('id', draggableId);

        if (error) throw error;
        
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

  return { handleDragEnd };
};