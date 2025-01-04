import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProspectDelete = () => {
  const handleDelete = async (id: string) => {
    try {
      console.log('Deleting prospect:', id);
      
      // First, delete any sequence assignments and history
      const { error: historyError } = await supabase
        .from("sequence_history")
        .delete()
        .eq("assignment_id", (
          await supabase
            .from("sequence_assignments")
            .select("id")
            .eq("prospect_id", id)
        ).data?.[0]?.id);

      if (historyError) {
        console.error("Error deleting sequence history:", historyError);
        throw historyError;
      }

      // Then delete sequence assignments
      const { error: assignmentsError } = await supabase
        .from("sequence_assignments")
        .delete()
        .eq("prospect_id", id);

      if (assignmentsError) {
        console.error("Error deleting sequence assignments:", assignmentsError);
        throw assignmentsError;
      }

      // Finally delete the prospect
      const { error } = await supabase
        .from("prospects")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting prospect:", error);
        throw error;
      }
      
      toast.success("Prospect deleted successfully");
    } catch (error) {
      console.error("Error deleting prospect:", error);
      toast.error("Failed to delete prospect");
    }
  };

  return { handleDelete };
};