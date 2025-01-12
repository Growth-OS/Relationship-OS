import { Prospect } from "@/types/prospects";

export type { Prospect };

export interface EditableProspect extends Prospect {
  isEditing: boolean;
}

export interface ProspectActionsProps {
  prospect: Prospect;
  onDelete: (id: string) => void;
  onEdit: (prospect: Prospect) => void;
  onConvertToLead: (prospect: Prospect) => Promise<void>;
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