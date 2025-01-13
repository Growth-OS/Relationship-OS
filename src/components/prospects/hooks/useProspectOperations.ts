import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { Prospect } from "../types/prospect";

export const useProspectOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('prospects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['prospects'] });
      toast.success('Prospect deleted successfully');
    } catch (error) {
      console.error('Error deleting prospect:', error);
      toast.error('Failed to delete prospect');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('prospects')
        .delete()
        .in('id', ids);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['prospects'] });
      toast.success('Prospects deleted successfully');
    } catch (error) {
      console.error('Error deleting prospects:', error);
      toast.error('Failed to delete prospects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Prospect>) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('prospects')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['prospects'] });
      toast.success('Prospect updated successfully');
    } catch (error) {
      console.error('Error updating prospect:', error);
      toast.error('Failed to update prospect');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleDelete,
    handleBulkDelete,
    handleUpdate,
  };
};