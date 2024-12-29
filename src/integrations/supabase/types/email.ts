export interface EmailMessage {
  id: string;
  user_id: string;
  message_id: string;
  conversation_id: string | null;
  from_email: string;
  from_name: string | null;
  to_emails: string[];
  cc_emails: string[] | null;
  bcc_emails: string[] | null;
  subject: string | null;
  body: string | null;
  snippet: string | null;
  received_at: string;
  sent_at: string | null;
  is_read: boolean;
  is_archived: boolean;
  is_starred: boolean;
  is_snoozed: boolean;
  snooze_until: string | null;
  folder: string;
  labels: string[] | null;
  has_attachments: boolean;
  created_at: string;
}