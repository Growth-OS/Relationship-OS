import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { LeadCompanyInfo } from "./components/LeadCompanyInfo";
import { LeadContactInfo } from "./components/LeadContactInfo";
import { LeadActions } from "./components/LeadActions";
import { useState } from "react";
import { EditLeadDialog } from "../components/EditLeadDialog";
import type { LeadRowProps } from "../types/lead";

export const LeadRow = ({
  lead,
  isSelected,
  onSelectChange,
  onEdit,
  onDelete,
}: LeadRowProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelectChange}
          />
        </TableCell>
        <TableCell>
          <LeadCompanyInfo lead={lead} />
        </TableCell>
        <TableCell>
          <LeadContactInfo lead={lead} />
        </TableCell>
        <TableCell>
          <LeadActions 
            lead={lead} 
            onEdit={() => setEditDialogOpen(true)}
          />
        </TableCell>
      </TableRow>

      <EditLeadDialog
        lead={lead}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={() => {
          setEditDialogOpen(false);
          onEdit(lead);
        }}
      />
    </>
  );
};