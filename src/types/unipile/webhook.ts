import { EmailAttendee } from './attendee';

export interface NewEmailWebhookPayload {
  email_id: string;
  account_id: string;
  event: 'mail_received' | 'mail_sent';
  webhook_name: string;
  date: string;
  from_attendee: EmailAttendee;
  to_attendees: EmailAttendee[];
  bcc_attendees: EmailAttendee[];
  cc_attendees: EmailAttendee[];
  reply_to_attendees: EmailAttendee[];
  provider_id: string;
  message_id: string;
  has_attachments: boolean;
  subject: string | null;
  body: string;
  body_plain: string;
  attachments: any[];
  folders: string[];
  role: string;
  read_date: string | null;
  is_complete: boolean;
  tracking_id?: string;
  origin: 'unipile' | 'external';
}

export interface EmailTrackingWebhookPayload {
  event: 'mail_link_clicked' | 'mail_opened';
  event_id: string;
  tracking_id: string;
  date: string;
  email_id: string;
  account_id: string;
  ip: string;
  user_agent: string;
  url?: string;
  label?: string;
  custom_domain?: string;
}