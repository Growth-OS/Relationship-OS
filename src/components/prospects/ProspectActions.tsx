import { Button } from "@/components/ui/button";
import { ArrowRight, Pencil, Trash2, ListPlus } from "lucide-react";
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
  onConvertToSequence?: (prospect: Prospect) => void;
}

export const ProspectActions = ({
  prospect,
  onDelete,
  onEdit,
  onConvertToLead,
  onConvertToSequence,
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

  const isInSequence = prospect.status === 'in_sequence';
  const isConverted = prospect.is_converted_to_deal || prospect.status === 'converted';

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
              disabled={isConverting || isConverted}
              className="text-purple-600 hover:text-purple-700"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isConverted
              ? "This prospect has already been converted"
              : "Convert to lead"}
          </TooltipContent>
        </Tooltip>

        {onConvertToSequence && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onConvertToSequence(prospect)}
                disabled={isInSequence || isConverted}
                className="text-blue-600 hover:text-blue-700"
              >
                <ListPlus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isInSequence
                ? "Already in sequence"
                : isConverted
                ? "Cannot add converted prospect to sequence"
                : "Add to sequence"}
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};