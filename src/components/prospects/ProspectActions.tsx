import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Play } from "lucide-react";
import { useState } from "react";
import { AssignSequenceDialog } from "./components/AssignSequenceDialog";
import { EditProspectDialog } from "./components/EditProspectDialog";
import { ConvertToLeadButton } from "./components/ConvertToLeadButton";
import type { ProspectActionsProps } from "./types/prospect";
import { useQueryClient } from "@tanstack/react-query";

export const ProspectActions = ({ prospect, onDelete }: ProspectActionsProps) => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  return (
    <div className="flex gap-2 justify-end">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsEditDialogOpen(true)}
        className="hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Pencil className="h-4 w-4 text-gray-600" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(prospect.id)}
        className="hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
      
      <ConvertToLeadButton prospect={prospect} />
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsAssignDialogOpen(true)}
        className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
        title="Assign to Sequence"
      >
        <Play className="h-4 w-4 text-blue-600" />
      </Button>

      <AssignSequenceDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        prospects={[prospect]}
        onSuccess={() => {
          setIsAssignDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: ['prospects'] });
        }}
      />

      <EditProspectDialog
        prospect={prospect}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={() => {
          setIsEditDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: ['prospects'] });
        }}
      />
    </div>
  );
};