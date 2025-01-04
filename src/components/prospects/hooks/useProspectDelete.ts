import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProspectDelete = () => {
  const handleDelete = async (id: string) => {
    try {
      console.log('Deleting prospect:', id);
      
      // First, get all sequence assignments for this prospect
      const { data: assignments, error: assignmentsError } = await supabase
        .from("sequence_assignments")
        .select("id")
        .eq("prospect_id", id);

      if (assignmentsError) {
        console.error("Error fetching assignments:", assignmentsError);
        throw assignmentsError;
      }

      // Delete sequence history for all assignments
      if (assignments && assignments.length > 0) {
        const assignmentIds = assignments.map(a => a.id);
        const { error: historyError } = await supabase
          .from("sequence_history")
          .delete()
          .in("assignment_id", assignmentIds);

        if (historyError) {
          console.error("Error deleting sequence history:", historyError);
          throw historyError;
        }
      }

      // Delete sequence assignments
      const { error: assignmentDeleteError } = await supabase
        .from("sequence_assignments")
        .delete()
        .eq("prospect_id", id);

      if (assignmentDeleteError) {
        console.error("Error deleting assignments:", assignmentDeleteError);
        throw assignmentDeleteError;
      }

      // Finally delete the prospect
      const { error: prospectError } = await supabase
        .from("prospects")
        .delete()
        .eq("id", id);

      if (prospectError) {
        console.error("Error deleting prospect:", prospectError);
        throw prospectError;
      }
      
      toast.success("Prospect deleted successfully");
      return true;
    } catch (error) {
      console.error("Error in deletion process:", error);
      toast.error("Failed to delete prospect");
      return false;
    }
  };

  return { handleDelete };
};