import { Button } from "@/components/ui/button";
import { Trash2, CheckSquare } from "lucide-react";
import { BulkAnalyzeButton } from "./BulkAnalyzeButton";

interface BulkActionsProps {
  selectedIds: string[];
  onSelectAll: () => void;
  onDelete?: (ids: string[]) => void;
}

export const BulkActions = ({
  selectedIds,
  onSelectAll,
  onDelete,
}: BulkActionsProps) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={onSelectAll}
      >
        <CheckSquare className="h-4 w-4" />
        {selectedIds.length > 0 ? 'Deselect All' : 'Select All'}
      </Button>

      <BulkAnalyzeButton selectedIds={selectedIds} />

      {selectedIds.length > 0 && onDelete && (
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-destructive"
          onClick={() => onDelete(selectedIds)}
        >
          <Trash2 className="h-4 w-4" />
          Delete Selected
        </Button>
      )}
    </div>
  );
};