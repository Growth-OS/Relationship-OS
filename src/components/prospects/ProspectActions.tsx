import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { EditProspectDialog } from "./components/EditProspectDialog";
import { ConvertToLeadButton } from "./components/ConvertToLeadButton";
import type { ProspectActionsProps } from "./types/prospect";
import { useQueryClient } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const ProspectActions = ({ prospect, onDelete, onEdit, onConvertToLead }: ProspectActionsProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(prospect.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditDialogOpen(true)}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Pencil className="h-4 w-4 text-gray-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit prospect details</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isLoading}
              className="hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 text-red-600 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 text-red-600" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete prospect</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <ConvertToLeadButton prospect={prospect} />

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