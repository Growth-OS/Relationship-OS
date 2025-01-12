import { TableRow } from "@/components/ui/table";
import { EditableCell } from "./EditableCell";
import { ProspectActions } from "./ProspectActions";
import { ProspectRowProps } from "../types/prospect";
import { toast } from "sonner";

export const ProspectRow = ({
  prospect,
  sourceLabels,
  onUpdate,
  editValues,
  setEditValues,
  startEditing,
  cancelEditing,
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
    <TableRow>
      <EditableCell
        isEditing={prospect.isEditing}
        value={editValues[prospect.id]?.company_name || prospect.company_name}
        onChange={(value) => handleInputChange("company_name", value)}
      />
      <EditableCell
        isEditing={prospect.isEditing}
        value={editValues[prospect.id]?.contact_email || prospect.contact_email || ""}
        onChange={(value) => handleInputChange("contact_email", value)}
        type="email"
      />
      <EditableCell
        isEditing={prospect.isEditing}
        value={editValues[prospect.id]?.source || prospect.source}
        onChange={(value) => handleInputChange("source", value)}
        type="select"
        options={sourceOptions}
      />
      <EditableCell
        isEditing={prospect.isEditing}
        value={editValues[prospect.id]?.contact_job_title || prospect.contact_job_title || ""}
        onChange={(value) => handleInputChange("contact_job_title", value)}
      />
      <ProspectActions
        isEditing={prospect.isEditing}
        onEdit={() => startEditing(prospect)}
        onSave={saveChanges}
        onCancel={() => cancelEditing(prospect.id)}
      />
    </TableRow>
  );
};