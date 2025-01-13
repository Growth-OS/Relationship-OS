import { TableCell, TableRow } from "@/components/ui/table";
import { EditableCell } from "./EditableCell";
import { ProspectActions } from "./ProspectActions";
import type { ProspectRowProps, EditableProspect } from "../types/prospect";
import { toast } from "sonner";

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

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="p-4 text-left">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelectChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
      </TableCell>
      <TableCell className="p-4 text-left font-medium">
        {prospect.company_name}
      </TableCell>
      <TableCell className="p-4 text-left">
        {sourceLabels[prospect.source]}
      </TableCell>
      <TableCell className="p-4 text-left">
        {prospect.contact_job_title || '-'}
      </TableCell>
      <TableCell className="p-4 text-left">
        {prospect.contact_email || '-'}
      </TableCell>
      <TableCell className="p-4 text-left">
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
      <TableCell className="p-4 text-left">
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
      <TableCell className="p-4 text-left">
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