import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Prospect } from "../types/prospect";
import { TaskSource } from "@/integrations/supabase/types/tasks";

export const useProspectOperations = () => {
  const queryClient = useQueryClient();

  const handleDelete = async (id: string) => {
    try {
      console.log('Deleting prospect:', id);
      const { error } = await supabase
        .from("prospects")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting prospect:", error);
        throw error;
      }
      
      await queryClient.invalidateQueries({ queryKey: ['prospects'] });
      toast.success("Prospect deleted successfully");
    } catch (error) {
      console.error("Error deleting prospect:", error);
      toast.error("Failed to delete prospect");
    }
  };

  const handleConvertToLead = async (prospect: Prospect) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to convert prospects');
        return;
      }

      console.log('Converting prospect to lead:', prospect);

      const { error } = await supabase
        .from('deals')
        .insert({
          user_id: user.id,
          company_name: prospect.company_name,
          contact_email: prospect.contact_email,
          contact_linkedin: prospect.contact_linkedin,
          contact_job_title: prospect.contact_job_title,
          stage: 'lead',
          source: prospect.source,
          notes: prospect.notes
        });

      if (error) {
        console.error('Error converting prospect to lead:', error);
        throw error;
      }

      // Update prospect status
      const { error: updateError } = await supabase
        .from('prospects')
        .update({ status: 'converted' })
        .eq('id', prospect.id);

      if (updateError) {
        console.error('Error updating prospect status:', updateError);
        throw updateError;
      }

      await queryClient.invalidateQueries({ queryKey: ['prospects'] });
      await queryClient.invalidateQueries({ queryKey: ['deals'] });
      
      toast.success('Prospect converted to lead successfully');
    } catch (error) {
      console.error('Error in conversion:', error);
      toast.error('Failed to convert prospect to lead');
    }
  };

  const handleAssignSequence = async (sequenceId: string, selectedIds: string[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to assign sequences');
        return;
      }

      // First check if any of the prospects are already assigned to this sequence
      const { data: existingAssignments, error: checkError } = await supabase
        .from("sequence_assignments")
        .select("prospect_id")
        .eq("sequence_id", sequenceId)
        .in("prospect_id", selectedIds);

      if (checkError) throw checkError;

      // Filter out prospects that are already assigned
      const existingProspectIds = existingAssignments?.map(a => a.prospect_id) || [];
      const prospectsToAssign = selectedIds.filter(id => !existingProspectIds.includes(id));

      if (prospectsToAssign.length === 0) {
        toast.error("Selected prospects are already assigned to this sequence");
        return;
      }

      // Get sequence details and steps
      const { data: sequence, error: sequenceError } = await supabase
        .from("sequences")
        .select(`
          *,
          sequence_steps (*)
        `)
        .eq("id", sequenceId)
        .single();

      if (sequenceError) throw sequenceError;

      // Create assignments and tasks for each prospect
      for (const prospectId of prospectsToAssign) {
        // Create the sequence assignment
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

        if (assignmentError) throw assignmentError;

        // Get prospect details for task creation
        const { data: prospect, error: prospectError } = await supabase
          .from("prospects")
          .select("*")
          .eq("id", prospectId)
          .single();

        if (prospectError) throw prospectError;

        // Create tasks for each step
        const tasks = sequence.sequence_steps.map(step => {
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + (step.delay_days || 0));
          
          const stepType = step.step_type === 'email' ? 'Send email' : 
                          step.step_type === 'linkedin' && step.step_number === 1 ? 'Send LinkedIn connection request' : 
                          'Send LinkedIn message';
          
          const contactMethod = step.step_type === 'email' ? 
            `(${prospect.contact_email})` : 
            `(${prospect.contact_linkedin})`;

          return {
            title: `${stepType} to ${prospect.company_name} - ${prospect.contact_job_title} ${contactMethod} - Step ${step.step_number}`,
            description: step.message_template,
            due_date: dueDate.toISOString().split('T')[0],
            source: 'sequences' as TaskSource,
            sequence_id: sequenceId,
            priority: 'medium',
            user_id: user.id,
            completed: false
          };
        });

        // Insert all tasks
        const { error: tasksError } = await supabase
          .from("tasks")
          .insert(tasks);

        if (tasksError) throw tasksError;
      }

      // Invalidate relevant queries
      await queryClient.invalidateQueries({ queryKey: ['prospects'] });
      await queryClient.invalidateQueries({ queryKey: ['sequences'] });
      await queryClient.invalidateQueries({ queryKey: ['tasks'] });

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

  return {
    handleDelete,
    handleConvertToLead,
    handleAssignSequence
  };
};