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
  source: string;
  status?: string;
  user_id?: string;
  ai_summary?: string;
  website_content?: string;
  last_ai_analysis_date?: string;
  scraping_status?: string;
  last_scrape_attempt?: string;
  scraping_error?: string;
}

export interface EditableLead extends Lead {
  isEditing: boolean;
}

export interface LeadRowProps {
  lead: Lead;
  sourceLabels: Record<string, string>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (lead: Lead) => void;
  isSelected: boolean;
  onSelectChange: (checked: boolean) => void;
}

export interface LeadCompanyInfoProps {
  lead: Lead;
}

export interface LeadContactInfoProps {
  lead: Lead;
}

export interface LeadActionsProps {
  lead: Lead;
  onEdit: () => void;
}