import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Lead, LeadRowProps } from "../types/lead";
import { LeadCompanyInfo } from "./components/LeadCompanyInfo";
import { LeadContactInfo } from "./components/LeadContactInfo";
import { LeadActions } from "./components/LeadActions";

export const LeadRow = ({
  lead,
  sourceLabels,
  onDelete,
  onEdit,
  isSelected,
  onSelectChange,
}: LeadRowProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState(lead);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(editedLead);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleChange = (field: keyof Lead, value: string) => {
    setEditedLead(prev => ({ ...prev, [field]: value }));
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="w-[50px]">
        <div className="flex items-center justify-center">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelectChange}
          />
        </div>
      </TableCell>
      <TableCell className="font-medium">
        <LeadCompanyInfo
          lead={lead}
          isEditing={isEditing}
          editedLead={editedLead}
          onEditChange={handleChange}
        />
      </TableCell>
      <TableCell>
        <Badge variant="outline">
          {sourceLabels[lead.source || 'other']}
        </Badge>
      </TableCell>
      <TableCell>
        <LeadContactInfo
          lead={lead}
          isEditing={isEditing}
          editedLead={editedLead}
          onEditChange={handleChange}
        />
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
        ) : '-'}
      </TableCell>
      <TableCell>
        <Badge variant={lead.status === 'new' ? 'outline' : 'secondary'}>
          {lead.status}
        </Badge>
      </TableCell>
      <TableCell>
        <LeadActions
          lead={lead}
          isEditing={isEditing}
          onEdit={handleEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};