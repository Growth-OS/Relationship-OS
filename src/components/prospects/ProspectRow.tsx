import { TableCell, TableRow } from "@/components/ui/table";
import { ProspectActions } from "./ProspectActions";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
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
      <TableCell className="p-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelectChange}
        />
      </TableCell>
      <TableCell className="p-4 font-medium text-left">{prospect.company_name}</TableCell>
      <TableCell className="p-4 text-muted-foreground text-left">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {sourceLabels[prospect.source]}
        </span>
      </TableCell>
      <TableCell className="p-4 text-muted-foreground text-left">{prospect.contact_job_title || '-'}</TableCell>
      <TableCell className="p-4 text-muted-foreground text-left">{prospect.contact_email || '-'}</TableCell>
      <TableCell className="p-4 text-left">
        {prospect.company_website ? (
          <a 
            href={prospect.company_website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 hover:underline"
          >
            Visit Website
          </a>
        ) : '-'}
      </TableCell>
      <TableCell className="p-4 text-left">
        {prospect.contact_linkedin ? (
          <a 
            href={prospect.contact_linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-700 hover:underline"
          >
            Profile
          </a>
        ) : '-'}
      </TableCell>
      <TableCell className="p-4 text-left">
        {prospect.sequence_name ? (
          <div className="space-y-1">
            <div>{prospect.sequence_name}</div>
            <Badge>
              {prospect.sequence_status || 'Not started'}
            </Badge>
          </div>
        ) : '-'}
      </TableCell>
      <TableCell className="p-4 text-left">
        {prospect.current_step ? (
          <div className="space-y-1">
            <div className="text-sm text-gray-600">Step {prospect.current_step}</div>
            <Progress value={prospect.current_step * 20} className="h-2" />
          </div>
        ) : '-'}
      </TableCell>
      <TableCell className="p-4">
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