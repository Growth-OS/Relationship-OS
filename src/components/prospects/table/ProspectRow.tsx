import { TableCell, TableRow } from "@/components/ui/table";
import { ProspectActions } from "../ProspectActions";
import { ExternalLinks } from "../components/ExternalLinks";
import type { Prospect } from "../types/prospect";

interface ProspectRowProps {
  prospect: Prospect;
  sourceLabels: Record<string, string>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (prospect: Prospect) => void;
  onConvertToLead: (prospect: Prospect) => Promise<void>;
}

export const ProspectRow = ({ 
  prospect, 
  sourceLabels, 
  onDelete, 
  onEdit,
  onConvertToLead
}: ProspectRowProps) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{prospect.company_name}</TableCell>
      <TableCell>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {sourceLabels[prospect.source]}
        </span>
      </TableCell>
      <TableCell>{prospect.contact_job_title || '-'}</TableCell>
      <TableCell>{prospect.contact_email || '-'}</TableCell>
      <TableCell>
        <ExternalLinks 
          website={prospect.company_website} 
          linkedin={prospect.contact_linkedin}
        />
      </TableCell>
      <TableCell>
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