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
      const { data, error } = await supabase
        .from("emails")
        .select("*")
        .order("received_at", { ascending: false });
      
      if (error) throw error;
      return data as Email[];
    },
    refetchInterval: 60000, // Refetch every minute
  });
};