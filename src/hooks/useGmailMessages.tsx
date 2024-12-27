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
  is_starred?: boolean;
  is_archived?: boolean;
  is_trashed?: boolean;
  snoozed_until?: string | null;
  is_sent?: boolean;
}

export const useGmailMessages = () => {
  return useQuery({
    queryKey: ['emails'],
    queryFn: async () => {
      console.log('Fetching emails...');
      const { data, error } = await supabase
        .from('emails')
        .select('*')
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
        date: email.received_at,
        is_starred: email.is_starred,
        is_archived: email.is_archived,
        is_trashed: email.is_trashed,
        snoozed_until: email.snoozed_until,
        is_sent: email.is_sent
      }));
    },
  });
};