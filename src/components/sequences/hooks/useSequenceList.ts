import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { type Sequence } from "../types";

export const useSequenceList = () => {
  const queryClient = useQueryClient();

  const { data: sequences, isLoading, error } = useQuery({
    queryKey: ["sequences"],
    queryFn: async () => {
      console.log('Fetching sequences...');
      const { data, error } = await supabase
        .from("sequences")
        .select(`
          *,
          sequence_steps (
            count
          ),
          sequence_assignments (
            id,
            status,
            current_step,
            prospect: prospects (
              company_name
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error('Error fetching sequences:', error);
        throw error;
      }

      console.log('Sequences fetched:', data);
      return data as unknown as Sequence[];
    },
  });

  const handleStatusChange = async (sequenceId: string, newStatus: 'active' | 'paused' | 'completed') => {
    try {
      const { error } = await supabase
        .from('sequences')
        .update({ status: newStatus })
        .eq('id', sequenceId);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['sequences'] });
      toast.success(`Sequence ${newStatus === 'active' ? 'activated' : 'paused'} successfully`);
    } catch (error) {
      console.error('Error updating sequence status:', error);
      toast.error('Failed to update sequence status');
    }
  };

  return {
    sequences,
    isLoading,
    error,
    handleStatusChange
  };
};