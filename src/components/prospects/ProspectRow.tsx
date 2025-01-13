import { TableCell, TableRow } from "@/components/ui/table";
import { ProspectActions } from "./ProspectActions";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLinks } from "./components/ExternalLinks";
import type { Prospect } from "./types/prospect";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const getStatusBadgeVariant = (status: string | undefined, isConverted: boolean | undefined) => {
    if (status === 'converted' || isConverted) return 'secondary';
    return 'default';
  };

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
        <Badge variant="outline">
          {sourceLabels[prospect.source]}
        </Badge>
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant={getStatusBadgeVariant(prospect.status, prospect.is_converted_to_deal)}>
                {prospect.is_converted_to_deal || prospect.status === 'converted' ? 'Converted' : 'Active'}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {prospect.is_converted_to_deal || prospect.status === 'converted' 
                ? 'This prospect has been converted to a deal'
                : 'This prospect is active and can be converted to a deal'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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