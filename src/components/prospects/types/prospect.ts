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

export interface ProspectActionsProps {
  prospect: Prospect;
  onDelete: (id: string) => Promise<void>;
  onConvertToLead: (prospect: Prospect) => Promise<void>;
  onEdit: (prospect: Prospect) => void;
}