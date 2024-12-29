export interface Email {
  id: string;
  created_at: string;
  message_id: string;
  from_email: string;
  subject: string;
  snippet: string | null;
  body: string | null;
  received_at: string;
  user_id: string;
  is_read: boolean;
  is_archived: boolean;
  is_starred: boolean;
  snoozed_until: string | null;
  is_trashed: boolean;
  is_sent: boolean;
}