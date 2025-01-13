import { TableCell, TableRow } from "@/components/ui/table";
import { EditableCell } from "./EditableCell";
import { ProspectActions } from "./ProspectActions";
import type { ProspectRowProps, EditableProspect } from "../types/prospect";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export const ProspectRow = ({
  prospect,
  sourceLabels,
  onUpdate,
  editValues,
  setEditValues,
  startEditing,
  cancelEditing,
  isSelected,
  onSelectChange,
}: ProspectRowProps) => {
  const handleInputChange = (field: keyof EditableProspect, value: string) => {
    setEditValues({
      ...editValues,
      [prospect.id]: {
        ...editValues[prospect.id],
        [field]: value,
      },
    });
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const saveChanges = async () => {
    const changes = editValues[prospect.id];
    
    if (changes.contact_email && !validateEmail(changes.contact_email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (changes.company_website && !validateUrl(changes.company_website)) {
      toast.error("Please enter a valid website URL");
      return;
    }

    try {
      await onUpdate(prospect.id, changes);
      toast.success("Changes saved successfully");
      cancelEditing(prospect.id);
    } catch (error) {
      toast.error("Failed to save changes");
    }
  };

  const sourceOptions = Object.entries(sourceLabels).map(([value, label]) => ({
    value,
    label,
  }));

  const getStatusBadgeVariant = (isConverted: boolean | undefined) => {
    if (isConverted) return 'secondary';
    return 'outline';
  };

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="w-[50px]">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelectChange}
          className="ml-4"
        />
      </TableCell>
      <TableCell className="font-medium">
        {prospect.company_name}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs capitalize">
          {sourceLabels[prospect.source]}
        </Badge>
      </TableCell>
      <TableCell>
        {prospect.contact_job_title || '-'}
      </TableCell>
      <TableCell>
        {prospect.contact_email || '-'}
      </TableCell>
      <TableCell>
        {prospect.company_website ? (
          <a
            href={prospect.company_website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Website
          </a>
        ) : '-'}
      </TableCell>
      <TableCell>
        {prospect.contact_linkedin ? (
          <a
            href={prospect.contact_linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            LinkedIn
          </a>
        ) : '-'}
      </TableCell>
      <TableCell>
        <Badge 
          variant={getStatusBadgeVariant(prospect.is_converted_to_deal)}
          className="text-xs"
        >
          {prospect.is_converted_to_deal ? 'Converted' : 'Active'}
        </Badge>
      </TableCell>
      <TableCell>
        <ProspectActions
          isEditing={prospect.isEditing}
          onEdit={() => startEditing(prospect)}
          onSave={saveChanges}
          onCancel={() => cancelEditing(prospect.id)}
        />
      </TableCell>
    </TableRow>
  );
};