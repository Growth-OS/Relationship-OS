import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AssignSequenceDialog } from "./AssignSequenceDialog";
import { useState } from "react";

interface BulkActionsProps {
  selectedIds: string[];
  allSelected: boolean;
  onSelectAll: () => void;
  onAssignSequence: (sequenceId: string, selectedIds: string[]) => Promise<void>;
}

export const BulkActions = ({
  selectedIds,
  allSelected,
  onSelectAll,
  onAssignSequence,
}: BulkActionsProps) => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="w-[50px] flex justify-center">
        <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={selectedIds.length === 0}
        onClick={() => setIsAssignDialogOpen(true)}
      >
        Assign to Sequence
      </Button>
      <AssignSequenceDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        onAssign={(sequenceId) => onAssignSequence(sequenceId, selectedIds)}
        onSuccess={() => setIsAssignDialogOpen(false)}
      />
    </div>
  );
};