import { Prospect } from "@/types/prospects";

export type { Prospect };

export interface EditableProspect extends Prospect {
  isEditing: boolean;
}

export interface ProspectRowProps {
  prospect: EditableProspect;
  sourceLabels: Record<string, string>;
  onUpdate: (id: string, data: Partial<Prospect>) => Promise<void>;
  editValues: Record<string, Partial<Prospect>>;
  setEditValues: (values: Record<string, Partial<Prospect>>) => void;
  startEditing: (prospect: EditableProspect) => void;
  cancelEditing: (id: string) => void;
}

export interface ProspectActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}