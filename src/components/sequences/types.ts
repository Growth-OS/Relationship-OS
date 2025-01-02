export type StepType = "email_1" | "email_2" | "linkedin_connection" | "linkedin_message_1" | "linkedin_message_2";

export interface SequenceStep {
  id: string;
  step_number: number;
  step_type: StepType;
  message_template: string;
  delay_days: number;
  preferred_time?: string;
}