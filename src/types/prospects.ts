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
}

export interface EditableProspect extends Prospect {
  isEditing?: boolean;
}