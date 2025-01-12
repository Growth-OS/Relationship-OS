import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProspectDelete = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (prospectId: string) => {
      const { error } = await supabase
        .from('prospects')
        .delete()
        .eq('id', prospectId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prospects'] });
      toast.success('Prospect deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting prospect:', error);
      toast.error('Failed to delete prospect');
    }
  });

  return {
    deleteProspect: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending
  };
};