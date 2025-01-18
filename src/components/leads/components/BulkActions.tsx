import { Button } from "@/components/ui/button";
import { UserPlus, CheckSquare } from "lucide-react";
import { useState } from "react";
import { AddToCampaignDialog } from "../components/AddToCampaignDialog";
import type { Lead } from "../types/lead";

interface BulkActionsProps {
  selectedIds: string[];
  onSelectAll: () => void;
  leads?: Lead[];
}

export const BulkActions = ({
  selectedIds,
  onSelectAll,
  leads = [],
}: BulkActionsProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const selectedLeads = leads.filter(lead => selectedIds.includes(lead.id));

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

      {selectedIds.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setDialogOpen(true)}
        >
          <UserPlus className="h-4 w-4" />
          Add to Campaign ({selectedIds.length})
        </Button>
      )}

      <AddToCampaignDialog
        leads={selectedLeads}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};