import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreVertical, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditLeadDialog } from "../components/EditLeadDialog";
import { useState } from "react";
import { LeadCompanyInfo } from "./components/LeadCompanyInfo";
import { LeadContactInfo } from "./components/LeadContactInfo";
import type { Lead } from "../types/lead";

interface LeadRowProps {
  lead: Lead;
  onDelete: (id: string) => Promise<void>;
  onEdit: (lead: Lead) => void;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
}

export const LeadRow = ({
  lead,
  isSelected,
  onSelectChange,
  onEdit,
  onDelete,
}: LeadRowProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const getLinkedInStatus = () => {
    if (!lead.contact_linkedin) return 'missing';
    if (lead.status === 'connected') return 'connected';
    return 'pending';
  };

  const renderLinkedInStatusIcon = () => {
    const status = getLinkedInStatus();
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'missing':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

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
          <span className="capitalize">{lead.source}</span>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            {renderLinkedInStatusIcon()}
            <span className="capitalize">{getLinkedInStatus()}</span>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                Edit Lead
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete(lead.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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