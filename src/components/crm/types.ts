import { DealStage, LeadSource } from "@/integrations/supabase/types/deals";

export interface DealFormData {
  company_name: string;
  stage: DealStage;
  deal_value: number;
  delivery_start_date?: string;
  delivery_end_date?: string;
  contact_email?: string;
  contact_linkedin?: string;
  contact_job_title?: string;
  country?: string;
  country_flag?: string;
  notes?: string;
  source?: LeadSource;
}