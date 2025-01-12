export type StepType = "email_1" | "email_2" | "linkedin_connection" | "linkedin_message_1" | "linkedin_message_2";
export type DatabaseStepType = "email" | "linkedin";
export type SequenceStatus = "active" | "paused" | "completed";

export interface SequenceStep {
  id: string;
  sequence_id: string;
  step_number: number;
  step_type: StepType;
  message_template: string | null;
  delay_days: number;
  created_at: string;
}

export interface SequenceAssignment {
  id: string;
  sequence_id: string;
  prospect_id: string;
  status: string;
  current_step: number;
  created_at: string;
  completed_at: string | null;
  paused_at: string | null;
  prospect?: {
    company_name: string;
    contact_email: string | null;
    contact_linkedin: string | null;
    contact_job_title: string | null;
  };
}

export interface Sequence {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  description: string | null;
  status: SequenceStatus;
  max_steps: number;
  sequence_steps?: SequenceStep[];
  sequence_assignments?: SequenceAssignment[];
  is_deleted: boolean;
}