import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowRight, Play } from "lucide-react";
import { useState } from "react";
import { AssignSequenceDialog } from "./components/AssignSequenceDialog";
import type { ProspectActionsProps } from "./types/prospect";

export const ProspectActions = ({ prospect, onDelete, onConvertToLead, onEdit }: ProspectActionsProps) => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  return (
    <div className="flex gap-2 justify-end">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(prospect)}
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
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onConvertToLead(prospect)}
        className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
        title="Convert to Lead"
      >
        <ArrowRight className="h-4 w-4 text-purple-600" />
      </Button>
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
        prospect={prospect}
      />
    </div>
  );
};