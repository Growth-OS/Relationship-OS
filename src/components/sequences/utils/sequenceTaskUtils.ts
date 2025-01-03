import { supabase } from "@/integrations/supabase/client";
import { addDays } from "date-fns";
import { DatabaseStepType } from "../types";

export const updateSequenceProgress = async (taskId: string, tasks: any[]) => {
  const task = tasks?.find(t => t.id === taskId);
  if (!task?.source === 'other' || !task.title.includes('sequence')) {
    return;
  }

  const sequenceName = task.title.match(/sequence "([^"]+)"/)?.[1];
  if (!sequenceName) return;

  // Get the sequence
  const { data: sequences } = await supabase
    .from('sequences')
    .select('id')
    .eq('name', sequenceName)
    .single();

  if (!sequences) return;

  // Get all assignments for this sequence
  const { data: assignments } = await supabase
    .from('sequence_assignments')
    .select(`
      *,
      sequence:sequences(
        id,
        sequence_steps(*)
      )
    `)
    .eq('sequence_id', sequences.id);

  if (!assignments || assignments.length === 0) return;

  // Update each assignment
  const updatePromises = assignments.map(async (assignment) => {
    const nextStep = assignment.current_step + 1;
    const steps = assignment.sequence.sequence_steps;
    
    // Find the next step's delay_days
    const nextStepData = steps.find(s => s.step_number === nextStep);
    const dueDate = nextStepData 
      ? addDays(new Date(), nextStepData.delay_days).toISOString()
      : null;

    // Update the assignment
    await supabase
      .from('sequence_assignments')
      .update({ 
        current_step: nextStep,
        status: nextStep >= steps.length ? 'completed' : 'active'
      })
      .eq('id', assignment.id);

    // Create next task if there is one
    if (nextStepData) {
      await createNextSequenceTask(sequenceName, nextStep, nextStepData, dueDate);
    }
  });

  await Promise.all(updatePromises);
};

const createNextSequenceTask = async (
  sequenceName: string,
  stepNumber: number,
  stepData: { step_type: DatabaseStepType; message_template: string },
  dueDate: string
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const actionType = getActionTypeForStep(stepData.step_type);

  await supabase
    .from("tasks")
    .insert({
      title: `${actionType} for sequence "${sequenceName}" - Step ${stepNumber}`,
      description: stepData.message_template,
      due_date: dueDate,
      source: 'other',
      priority: 'medium',
      user_id: user.id
    });
};

const getActionTypeForStep = (stepType: DatabaseStepType): string => {
  switch (stepType) {
    case 'email':
      return 'Send email';
    case 'linkedin':
      return 'Send LinkedIn message';
    default:
      return 'Send message';
  }
};