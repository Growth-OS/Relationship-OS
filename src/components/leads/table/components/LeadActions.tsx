import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddToCampaignDialog } from "../../components/AddToCampaignDialog";
import { useState } from "react";
import type { Lead } from "../../types/lead";

interface LeadActionsProps {
  lead: Lead;
  onEdit: () => void;
}

export const LeadActions = ({ lead, onEdit }: LeadActionsProps) => {
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onEdit}
        className="h-8 w-8"
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setCampaignDialogOpen(true)}>
            Add to Campaign
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddToCampaignDialog
        leads={[lead]}
        open={campaignDialogOpen}
        onOpenChange={setCampaignDialogOpen}
      />
    </div>
  );
};