export interface Prospect {
  id: string;
  company_name: string;
  contact_email?: string;
  contact_job_title?: string;
  contact_linkedin?: string;
  company_website?: string;
  source: 'website' | 'referral' | 'linkedin' | 'cold_outreach' | 'conference' | 'accelerator' | 'other';
  notes?: string;
  status?: string;
  first_name?: string;
  training_event?: string;
  is_converted_to_deal?: boolean;
  created_at: string;
}

export interface EditableProspect extends Prospect {
  isEditing?: boolean;
}