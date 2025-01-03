import { TaskSource } from "@/integrations/supabase/types/tasks";
import { addDays, format } from "date-fns";
import { DatabaseStepType } from "../types";

interface ProspectInfo {
  company_name: string;
  contact_job_title?: string;
  contact_email?: string;
  contact_linkedin?: string;
}

interface SequenceStep {
  step_type: DatabaseStepType;
  step_number: number;
  message_template: string | null;
  delay_days: number;
}

export const createSequenceTasks = (
  steps: SequenceStep[],
  prospect: ProspectInfo,
  userId: string
) => {
  return steps.map(step => {
    const dueDate = addDays(new Date(), step.delay_days || 0);
    const stepType = step.step_type === 'email' ? 'Send email' : 
                    step.step_type === 'linkedin' && step.step_number === 1 ? 'Send LinkedIn connection request' : 
                    'Send LinkedIn message';
    
    const contactMethod = step.step_type === 'email' ? 
      `(${prospect.contact_email})` : 
      `(${prospect.contact_linkedin})`;

    return {
      title: `${stepType} to ${prospect.company_name} - ${prospect.contact_job_title} ${contactMethod} - Step ${step.step_number}`,
      description: step.message_template,
      due_date: format(dueDate, 'yyyy-MM-dd'),
      source: 'other' as TaskSource,
      priority: 'medium',
      user_id: userId
    };
  });
};