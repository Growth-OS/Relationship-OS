export interface Lead {
  id: string;
  created_at: string;
  company_name: string;
  contact_email?: string;
  contact_job_title?: string;
  contact_linkedin?: string;
  company_website?: string;
  first_name?: string;
  notes?: string;
  source?: 'website' | 'referral' | 'linkedin' | 'cold_outreach' | 'conference' | 'accelerator' | 'other';
  status?: string;
}

export interface EditableLead extends Lead {
  isEditing: boolean;
}

export interface LeadRowProps {
  lead: Lead;
  sourceLabels: Record<string, string>;
  onDelete: (id: string) => Promise<void>;
  onEdit: () => void;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
}

export interface LeadCompanyInfoProps {
  lead: Lead;
  isEditing: boolean;
  editedLead: Lead;
  onEditChange: (field: keyof Lead, value: string) => void;
}

export interface LeadContactInfoProps {
  lead: Lead;
  isEditing: boolean;
  editedLead: Lead;
  onEditChange: (field: keyof Lead, value: string) => void;
}

export interface LeadActionsProps {
  lead: Lead;
  onDelete: (id: string) => Promise<void>;
  onEdit: () => void;
}