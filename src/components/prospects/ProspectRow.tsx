import { TableCell, TableRow } from "@/components/ui/table";
import { ProspectActions } from "./ProspectActions";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLinks } from "./components/ExternalLinks";
import type { Prospect } from "./types/prospect";
import { toast } from "sonner";

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
  const getStatusBadgeVariant = (isConverted: boolean | undefined) => {
    if (isConverted) return 'secondary';
    return 'outline';
  };

  const getStatusText = () => {
    if (prospect.is_converted_to_deal) return 'Converted to Lead';
    return 'Active';
  };

  const handleConvertToLead = async () => {
    try {
      await onConvertToLead(prospect);
      toast.success("Prospect successfully converted to a lead");
    } catch (error) {
      console.error('Error converting prospect:', error);
      toast.error("Failed to convert prospect to lead");
    }
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="p-4 text-left">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelectChange}
        />
      </TableCell>
      <TableCell className="p-4 text-left font-medium">{prospect.company_name}</TableCell>
      <TableCell className="p-4 text-left">
        <Badge variant="outline" className="text-left">
          {sourceLabels[prospect.source]}
        </Badge>
      </TableCell>
      <TableCell className="p-4 text-left">{prospect.contact_job_title || '-'}</TableCell>
      <TableCell className="p-4 text-left">{prospect.contact_email || '-'}</TableCell>
      <TableCell className="p-4 text-left">
        <ExternalLinks 
          website={prospect.company_website} 
          linkedin={prospect.contact_linkedin}
        />
      </TableCell>
      <TableCell className="p-4 text-left">
        <Badge 
          variant={getStatusBadgeVariant(prospect.is_converted_to_deal)}
        >
          {getStatusText()}
        </Badge>
      </TableCell>
      <TableCell className="p-4 text-left">
        <ProspectActions
          prospect={prospect}
          onDelete={onDelete}
          onEdit={onEdit}
          onConvertToLead={handleConvertToLead}
        />
      </TableCell>
    </TableRow>
  );
};