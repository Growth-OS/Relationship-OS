import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addDays, format } from "date-fns";
import { TaskSource } from "@/integrations/supabase/types/tasks";
import { mapDbStepTypeToFrontend } from "../utils/stepTypeMapping";

export const useSequenceTaskOperations = () => {
  const queryClient = useQueryClient();

  const createSequenceTasks = async (
    sequenceId: string,
    prospectId: string,
    steps: any[],
    prospect: any,
    user: any
  ) => {
    const tasks = steps.map(step => {
      const dueDate = addDays(new Date(), step.delay_days || 0);
      const stepType = mapDbStepTypeToFrontend(step.step_type, step.step_number);
      const actionType = stepType.startsWith('email') ? 'Send email' : 
                        stepType === 'linkedin_connection' ? 'Send LinkedIn connection request' : 
                        'Send LinkedIn message';
      
      const contactMethod = stepType.startsWith('email') ? 
        `(${prospect.contact_email})` : 
        `(${prospect.contact_linkedin})`;

      return {
        title: `${actionType} to ${prospect.company_name} - ${prospect.contact_job_title} ${contactMethod} - Step ${step.step_number}`,
        description: step.message_template,
        due_date: format(dueDate, 'yyyy-MM-dd'),
        source: 'sequences' as TaskSource,
        sequence_id: sequenceId,
        priority: 'medium',
        user_id: user.id
      };
    });

    if (tasks.length > 0) {
      const { error: tasksError } = await supabase
        .from("tasks")
        .insert(tasks);

      if (tasksError) {
        console.error("Error creating tasks:", tasksError);
        throw tasksError;
      }
    }

    queryClient.invalidateQueries({ queryKey: ["weekly-tasks"] });
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  return { createSequenceTasks };
};