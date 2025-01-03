export interface Prospect {
  id: string;
  company_name: string;
  contact_email?: string;
  contact_job_title?: string;
  contact_linkedin?: string;
  source: 'website' | 'referral' | 'linkedin' | 'cold_outreach' | 'conference' | 'other';
  notes?: string;
}

export interface ProspectActionsProps {
  prospect: Prospect;
  onDelete: (id: string) => Promise<void>;
  onConvertToLead: (prospect: Prospect) => Promise<void>;
  onEdit: (prospect: Prospect) => void;
}