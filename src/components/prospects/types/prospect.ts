import { Prospect } from "@/types/prospects";

export interface EditableProspect extends Prospect {
  isEditing: boolean;
}

export interface ProspectActionsProps {
  prospect: Prospect;
  onDelete: (id: string) => void;
}

export interface ProspectRowProps {
  prospect: EditableProspect;
  sourceLabels: Record<string, string>;
  onUpdate: (id: string, data: Partial<EditableProspect>) => Promise<void>;
  editValues: Record<string, Partial<EditableProspect>>;
  setEditValues: (values: Record<string, Partial<EditableProspect>>) => void;
  startEditing: (prospect: EditableProspect) => void;
  cancelEditing: (id: string) => void;
}