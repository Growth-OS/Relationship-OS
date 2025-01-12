import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProspectOperations = () => {
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("prospects")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Prospect deleted successfully");
    } catch (error) {
      console.error("Error deleting prospect:", error);
      toast.error("Failed to delete prospect");
    }
  };

  const handleConvertToLead = async (prospect: any) => {
    try {
      const { error } = await supabase
        .from("deals")
        .insert({
          company_name: prospect.company_name,
          contact_email: prospect.contact_email,
          contact_job_title: prospect.contact_job_title,
          contact_linkedin: prospect.contact_linkedin,
          source: prospect.source,
          stage: "lead",
        });

      if (error) throw error;
      toast.success("Prospect converted to lead successfully");
    } catch (error) {
      console.error("Error converting prospect:", error);
      toast.error("Failed to convert prospect to lead");
    }
  };

  const handleAssignSequence = async (sequenceId: string, selectedIds: string[]) => {
    try {
      const { error } = await supabase
        .from("sequence_assignments")
        .insert(
          selectedIds.map((prospectId) => ({
            sequence_id: sequenceId,
            prospect_id: prospectId,
            status: "active",
            current_step: 1,
          }))
        );

      if (error) throw error;
      toast.success("Sequence assigned successfully");
      return true;
    } catch (error) {
      console.error("Error assigning sequence:", error);
      toast.error("Failed to assign sequence");
      return false;
    }
  };

  return { handleDelete, handleConvertToLead, handleAssignSequence };
};