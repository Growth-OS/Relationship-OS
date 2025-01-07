export type DealStage = 'lead' | 'meeting' | 'negotiation' | 'project_preparation' | 'in_progress' | 'to_invoice' | 'invoiced' | 'paid' | 'lost';
export type LeadSource = 'website' | 'referral' | 'linkedin' | 'cold_outreach' | 'conference' | 'other';
export type LostReason = 'price_too_high' | 'chose_competitor' | 'no_budget' | 'timing_not_right' | 'no_decision_made' | 'requirements_changed' | 'lost_contact';

export interface Deal {
  id: string;
  created_at: string;
  user_id: string;
  company_name: string;
  deal_value: number;
  delivery_start_date: string | null;
  delivery_end_date: string | null;
  contact_email: string | null;
  contact_linkedin: string | null;
  contact_job_title: string | null;
  last_activity_date: string;
  stage: DealStage;
  country: string | null;
  country_flag: string | null;
  notes: string | null;
  source: LeadSource | null;
  lost_reason: LostReason | null;
}

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