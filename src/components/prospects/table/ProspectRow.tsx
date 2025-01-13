import { TableCell, TableRow } from "@/components/ui/table";
import { ProspectActions } from "./ProspectActions";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLinks } from "../components/ExternalLinks";
import type { ProspectRowProps } from "../types/prospect";

export const ProspectRow = ({
  prospect,
  sourceLabels,
  onDelete,
  onEdit,
  onConvertToLead,
  isSelected,
  onSelectChange,
}: ProspectRowProps) => {
  const getStatusBadgeVariant = (isConverted: boolean | undefined) => {
    if (isConverted) return 'secondary';
    return 'outline';
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
      <TableCell className="font-medium text-left">{prospect.company_name}</TableCell>
      <TableCell className="text-left">
        <Badge variant="outline">
          {sourceLabels[prospect.source]}
        </Badge>
      </TableCell>
      <TableCell className="text-left">{prospect.contact_job_title || '-'}</TableCell>
      <TableCell className="text-left">{prospect.contact_email || '-'}</TableCell>
      <TableCell className="text-left">
        <ExternalLinks 
          website={prospect.company_website} 
          linkedin={prospect.contact_linkedin}
        />
      </TableCell>
      <TableCell className="text-left">
        <Badge 
          variant={getStatusBadgeVariant(prospect.is_converted_to_deal)}
        >
          {prospect.is_converted_to_deal ? 'Converted' : 'Active'}
        </Badge>
      </TableCell>
      <TableCell className="text-left">
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