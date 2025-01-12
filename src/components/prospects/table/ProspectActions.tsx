import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { Check, Edit2, X } from "lucide-react";

interface ProspectActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProspectActions = ({ isEditing, onEdit, onSave, onCancel }: ProspectActionsProps) => {
  return (
    <TableCell>
      {isEditing ? (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={onSave}>
            <Check className="h-4 w-4 text-green-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ) : (
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit2 className="h-4 w-4" />
        </Button>
      )}
    </TableCell>
  );
};