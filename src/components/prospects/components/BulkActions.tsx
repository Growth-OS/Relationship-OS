import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export interface BulkActionsProps {
  selectedIds: string[];
  allSelected: boolean;
  onSelectAll: () => void;
  onSuccess: () => void;
}

export const BulkActions = ({
  selectedIds,
  allSelected,
  onSelectAll,
  onSuccess,
}: BulkActionsProps) => {
  const queryClient = useQueryClient();

  const handleBulkDelete = async () => {
    try {
      const { error } = await supabase
        .from('prospects')
        .delete()
        .in('id', selectedIds);

      if (error) throw error;

      // Invalidate and refetch prospects data
      await queryClient.invalidateQueries({ queryKey: ['prospects'] });
      
      toast.success("Selected prospects deleted successfully");
      onSuccess();
    } catch (error) {
      console.error('Error deleting prospects:', error);
      toast.error("Failed to delete prospects");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onSelectAll}
      >
        {allSelected ? "Deselect All" : "Select All"}
      </Button>
      {selectedIds.length > 0 && (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleBulkDelete}
        >
          Delete Selected ({selectedIds.length})
        </Button>
      )}
    </div>
  );
};