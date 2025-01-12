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
}

export interface EditableProspect extends Prospect {
  isEditing: boolean;
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