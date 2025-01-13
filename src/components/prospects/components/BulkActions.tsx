import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface BulkActionsProps {
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleBulkDelete = async () => {
    try {
      const { error } = await supabase
        .from('prospects')
        .delete()
        .in('id', selectedIds);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['prospects'] });
      toast.success(`Successfully deleted ${selectedIds.length} prospects`);
      onSuccess();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting prospects:', error);
      toast.error('Failed to delete prospects');
    }
  };

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="w-[50px] flex justify-center">
        <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={selectedIds.length === 0}
          >
            Bulk Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive"
          >
            Delete Selected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Prospects</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedIds.length} prospects? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};