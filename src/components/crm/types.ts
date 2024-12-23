export interface DealFormData {
  company_name: string;
  stage: 'lead' | 'contact_made' | 'proposal_sent' | 'negotiation' | 'closed_won' | 'closed_lost';
  deal_value: number;
  delivery_start_date?: string;
  delivery_end_date?: string;
  contact_email?: string;
  contact_linkedin?: string;
  contact_job_title?: string;
}