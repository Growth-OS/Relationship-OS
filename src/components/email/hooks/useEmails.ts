import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Email {
  id: string;
  from_email: string;
  subject: string;
  snippet: string | null;
  body: string | null;
  received_at: string;
  is_read: boolean;
  is_starred: boolean;
  is_archived: boolean;
  is_trashed: boolean;
}

export const useEmails = () => {
  return useQuery({
    queryKey: ["emails"],
    queryFn: async () => {
      console.log("Fetching emails...");
      const { data, error } = await supabase
        .from("emails")
        .select("*")
        .eq('is_archived', false)
        .eq('is_trashed', false)
        .order("received_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching emails:", error);
        throw error;
      }
      
      console.log("Fetched emails:", data?.length || 0);
      return data as Email[];
    },
    refetchInterval: 60000, // Refetch every minute
  });
};