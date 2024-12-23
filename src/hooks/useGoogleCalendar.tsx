import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useGoogleCalendar = () => {
  return useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/functions/v1/calendar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch calendar events: ${errorText}`);
      }

      return response.json();
    },
    retry: 1,
    meta: {
      onError: (error: Error) => {
        console.error('Calendar query error:', error);
        toast.error('Failed to fetch calendar events: ' + error.message);
      }
    }
  });
};