import { LeadSource } from './deals';

export interface Prospect {
  id: string;
  created_at: string;
  user_id: string;
  company_name: string;
  contact_email: string | null;
  contact_job_title: string | null;
  source: LeadSource;
  notes: string | null;
  status: string | null;
  contact_linkedin: string | null;
}