import { Button } from "@/components/ui/button";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ConvertToDealDialog } from "../components/ConvertToDealDialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Prospect } from "../types/prospect";

interface ProspectActionsProps {
  prospect: Prospect;
  onDelete: (id: string) => Promise<void>;
  onEdit: (prospect: Prospect) => void;
}

export const ProspectActions = ({
  prospect,
  onDelete,
  onEdit,
}: ProspectActionsProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConvertDialog, setShowConvertDialog] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(prospect.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(prospect)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit prospect</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete prospect</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowConvertDialog(true)}
              disabled={prospect.is_converted_to_deal}
              className="text-purple-600 hover:text-purple-700"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {prospect.is_converted_to_deal
              ? "Already converted to deal"
              : "Convert to deal"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Convert to Deal</DialogTitle>
          </DialogHeader>
          <ConvertToDealDialog
            open={showConvertDialog}
            onOpenChange={setShowConvertDialog}
            prospects={[prospect]}
            onSuccess={() => {
              setShowConvertDialog(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};