import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
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
          {lead.contact_linkedin ? (
            <a
              href={lead.contact_linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 hover:underline"
            >
              View Profile
            </a>
          ) : (
            <span className="text-gray-400">No profile</span>
          )}
        </TableCell>
        <TableCell>
          <span className={`capitalize ${
            lead.status === 'in_campaign' ? 'text-green-600' : 'text-gray-600'
          }`}>
            {lead.status || 'new'}
          </span>
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