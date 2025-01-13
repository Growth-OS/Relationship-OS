export interface Prospect {
  id: string;
  company_name: string;
  contact_email?: string;
  contact_job_title?: string;
  contact_linkedin?: string;
  company_website?: string;
  source: 'website' | 'referral' | 'linkedin' | 'cold_outreach' | 'conference' | 'accelerator' | 'other';
  notes?: string;
  sequence_name?: string;
  sequence_status?: string;
  current_step?: number;
  status?: string;
  first_name?: string;
  training_event?: string;
  is_converted_to_deal?: boolean;
  created_at: string;
}

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
  prospect: Prospect;
  onDelete: (id: string) => Promise<void>;
  onEdit: (prospect: Prospect) => void;
  onConvertToLead: (prospect: Prospect) => Promise<void>;
  onConvertToSequence?: (prospect: Prospect) => void;
}

export interface TableProspectActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}