export interface Lead {
  id: string;
  company_name: string;
  contact_email?: string;
  contact_job_title?: string;
  contact_linkedin?: string;
  company_website?: string;
  first_name?: string;
  notes?: string;
  source: string;
  status: string;
  created_at: string;
}

export interface EditableLead extends Lead {
  isEditing?: boolean;
}

export interface LeadRowProps {
  lead: Lead;
  sourceLabels: Record<string, string>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (lead: Lead) => void;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
}