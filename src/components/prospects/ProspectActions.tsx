import { Button } from "@/components/ui/button";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";
import type { Prospect } from "./types/prospect";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProspectActionsProps {
  prospect: Prospect;
  onDelete: (id: string) => Promise<void>;
  onEdit: (prospect: Prospect) => void;
  onConvertToLead: (prospect: Prospect) => Promise<void>;
}

export const ProspectActions = ({
  prospect,
  onDelete,
  onEdit,
  onConvertToLead,
}: ProspectActionsProps) => {
  const [isConverting, setIsConverting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(prospect.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConvertToLead = async () => {
    try {
      setIsConverting(true);
      await onConvertToLead(prospect);
    } finally {
      setIsConverting(false);
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
              onClick={handleConvertToLead}
              disabled={isConverting || prospect.is_converted_to_deal || prospect.status === 'converted'}
              className="text-purple-600 hover:text-purple-700"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {prospect.is_converted_to_deal || prospect.status === 'converted'
              ? "This prospect has already been converted"
              : "Convert to lead"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};