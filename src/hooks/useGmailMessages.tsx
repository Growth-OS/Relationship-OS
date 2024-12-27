import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  body?: string;
}

export const useGmailMessages = () => {
  return useQuery({
    queryKey: ['emails'],
    queryFn: async () => {
      console.log('Fetching emails...');
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('is_archived', false)
        .order('received_at', { ascending: false });

      if (error) {
        console.error('Error fetching emails:', error);
        toast.error('Failed to fetch emails');
        throw error;
      }

      console.log('Fetched emails:', data);

      return data.map(email => ({
        id: email.message_id,
        from: email.from_email,
        subject: email.subject,
        snippet: email.snippet || email.subject,
        body: email.body,
        date: email.received_at
      }));
    },
  });
};