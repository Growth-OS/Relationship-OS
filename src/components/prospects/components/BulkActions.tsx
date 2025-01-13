import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AssignSequenceDialog } from "./AssignSequenceDialog";
import { ConvertToDealDialog } from "./ConvertToDealDialog";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { Prospect } from "../types/prospect";

interface BulkActionsProps {
  selectedIds: string[];
  allSelected: boolean;
  onSelectAll: () => void;
  selectedProspects: Prospect[];
  onSuccess: () => void;
}

export const BulkActions = ({
  selectedIds,
  allSelected,
  onSelectAll,
  selectedProspects,
  onSuccess,
}: BulkActionsProps) => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
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

  const handleAssignToSequence = async (sequenceId: string) => {
    try {
      const { error } = await supabase
        .from('prospects')
        .update({ sequence_id: sequenceId })
        .in('id', selectedIds);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['prospects'] });
      toast.success(`Successfully assigned ${selectedIds.length} prospects to sequence`);
      onSuccess();
    } catch (error) {
      console.error('Error assigning prospects to sequence:', error);
      toast.error('Failed to assign prospects to sequence');
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
          <DropdownMenuItem onClick={() => setIsConvertDialogOpen(true)}>
            Convert to Deal
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsAssignDialogOpen(true)}>
            Assign to Sequence
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive"
          >
            Delete Selected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AssignSequenceDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        selectedProspects={selectedIds}
        onAssign={handleAssignToSequence}
        onSuccess={() => {
          setIsAssignDialogOpen(false);
          onSuccess();
        }}
      />

      <ConvertToDealDialog
        open={isConvertDialogOpen}
        onOpenChange={setIsConvertDialogOpen}
        prospects={selectedProspects}
        onSuccess={onSuccess}
      />

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