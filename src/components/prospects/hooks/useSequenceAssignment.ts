import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TaskSource } from "@/integrations/supabase/types/tasks";

export const useSequenceAssignment = () => {
  const handleAssignSequence = async (sequenceId: string, selectedIds: string[]) => {
    try {
      console.log('Starting sequence assignment:', { sequenceId, selectedIds });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to assign sequences');
        return false;
      }

      // Check for existing assignments
      const { data: existingAssignments, error: checkError } = await supabase
        .from("sequence_assignments")
        .select("prospect_id")
        .eq("sequence_id", sequenceId)
        .in("prospect_id", selectedIds);

      if (checkError) {
        console.error('Error checking existing assignments:', checkError);
        throw checkError;
      }

      const existingProspectIds = existingAssignments?.map(a => a.prospect_id) || [];
      const prospectsToAssign = selectedIds.filter(id => !existingProspectIds.includes(id));

      if (prospectsToAssign.length === 0) {
        toast.error("Selected prospects are already assigned to this sequence");
        return false;
      }

      // Get sequence details
      const { data: sequence, error: sequenceError } = await supabase
        .from("sequences")
        .select(`
          *,
          sequence_steps (*)
        `)
        .eq("id", sequenceId)
        .single();

      if (sequenceError) {
        console.error('Error fetching sequence details:', sequenceError);
        throw sequenceError;
      }

      console.log('Sequence details:', sequence);

      // Create assignments and tasks
      for (const prospectId of prospectsToAssign) {
        // Create assignment
        const { data: assignment, error: assignmentError } = await supabase
          .from("sequence_assignments")
          .insert({
            sequence_id: sequenceId,
            prospect_id: prospectId,
            status: 'active',
            current_step: 1
          })
          .select()
          .single();

        if (assignmentError) {
          console.error('Error creating assignment:', assignmentError);
          throw assignmentError;
        }

        console.log('Created assignment:', assignment);

        // Get prospect details
        const { data: prospect, error: prospectError } = await supabase
          .from("prospects")
          .select("*")
          .eq("id", prospectId)
          .single();

        if (prospectError) {
          console.error('Error fetching prospect:', prospectError);
          throw prospectError;
        }

        // Create tasks for each step
        const tasks = sequence.sequence_steps.map(step => ({
          title: `${step.step_type === 'email' ? 'Send email' : 
                 step.step_type === 'linkedin' && step.step_number === 1 ? 'Send LinkedIn connection request' : 
                 'Send LinkedIn message'} to ${prospect.company_name} - ${prospect.contact_job_title} (${
                   step.step_type === 'email' ? prospect.contact_email : prospect.contact_linkedin
                 }) - Step ${step.step_number}`,
          description: step.message_template,
          due_date: new Date(Date.now() + (step.delay_days || 0) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          source: 'sequences' as TaskSource,
          sequence_id: sequenceId,
          priority: 'medium',
          user_id: user.id,
          completed: false
        }));

        console.log('Creating tasks:', tasks);

        const { error: tasksError } = await supabase
          .from("tasks")
          .insert(tasks);

        if (tasksError) {
          console.error('Error creating tasks:', tasksError);
          throw tasksError;
        }
      }

      toast.success(
        existingProspectIds.length > 0
          ? "Prospects assigned to sequence (some were already assigned)"
          : "Prospects assigned to sequence"
      );
      
      return true;
    } catch (error) {
      console.error("Error assigning sequence:", error);
      toast.error("Failed to assign sequence");
      return false;
    }
  };

  return { handleAssignSequence };
};