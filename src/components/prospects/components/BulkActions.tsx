import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { AssignSequenceDialog } from "./AssignSequenceDialog";
import { useState } from "react";
import type { Prospect } from "../types/prospect";

interface BulkActionsProps {
  selectedProspects: Prospect[];
  onSuccess: () => void;
}

export const BulkActions = ({ selectedProspects, onSuccess }: BulkActionsProps) => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  if (selectedProspects.length === 0) return null;

  return (
    <div className="mb-4 flex justify-between items-center">
      <Button
        onClick={() => setIsAssignDialogOpen(true)}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Users className="w-4 h-4 mr-2" />
        Assign {selectedProspects.length} Prospects to Sequence
      </Button>

      <AssignSequenceDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        prospects={selectedProspects}
        onSuccess={() => {
          setIsAssignDialogOpen(false);
          onSuccess();
        }}
      />
    </div>
  );
};