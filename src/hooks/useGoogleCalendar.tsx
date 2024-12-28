import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useGoogleCalendar = () => {
  return useQuery({
    queryKey: ['google-calendar-connection'],
    queryFn: async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error("You must be logged in to view calendar");
      }

      const { data: connection, error } = await supabase
        .from("oauth_connections")
        .select("*")
        .eq("user_id", user.id)
        .eq("provider", "google")
        .single();

      if (error) {
        console.error("Error checking Google connection:", error);
        return { isConnected: false };
      }

      return {
        isConnected: !!connection,
        connection
      };
    },
  });
};