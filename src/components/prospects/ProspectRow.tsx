import { TableCell, TableRow } from "@/components/ui/table";
import { ProspectActions } from "./ProspectActions";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLinks } from "./components/ExternalLinks";
import type { Prospect } from "./types/prospect";

interface ProspectRowProps {
  prospect: Prospect;
  sourceLabels: Record<string, string>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (prospect: any) => void;
  onConvertToLead: (prospect: Prospect) => Promise<void>;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
}

export const ProspectRow = ({ 
  prospect, 
  sourceLabels, 
  onDelete, 
  onEdit,
  onConvertToLead,
  isSelected,
  onSelectChange
}: ProspectRowProps) => {
  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="p-4 text-left align-top">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelectChange}
        />
      </TableCell>
      <TableCell className="p-4 text-left align-top">{prospect.company_name}</TableCell>
      <TableCell className="p-4 text-left align-top">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {sourceLabels[prospect.source]}
        </span>
      </TableCell>
      <TableCell className="p-4 text-left align-top">{prospect.contact_job_title || '-'}</TableCell>
      <TableCell className="p-4 text-left align-top">{prospect.contact_email || '-'}</TableCell>
      <TableCell className="p-4 text-left align-top">
        <ExternalLinks 
          website={prospect.company_website} 
          linkedin={prospect.contact_linkedin}
        />
      </TableCell>
      <TableCell className="p-4 text-left align-top">
        <ProspectActions
          prospect={prospect}
          onDelete={onDelete}
          onEdit={onEdit}
          onConvertToLead={onConvertToLead}
        />
      </TableCell>
    </TableRow>
  );
};