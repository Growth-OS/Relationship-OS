import { EmailAttendee } from './attendee';
import { EmailAttachment } from './attachment';

export interface UnipileEmail {
  object: 'Email';
  id: string;
  account_id: string;
  date: string;
  from_attendee: EmailAttendee;
  to_attendees: EmailAttendee[];
  cc_attendees: EmailAttendee[];
  bcc_attendees: EmailAttendee[];
  reply_to_attendees: EmailAttendee[];
  provider_id: string;
  subject: string | null;
  body: string | null;
  body_plain: string;
  has_attachments: boolean;
  attachments: EmailAttachment[];
  folders: string[];
  role: string;
  read_date: string | null;
  is_complete: boolean;
  headers?: Array<{
    name: string;
    value: string;
  }>;
}

export interface EmailTrackingOptions {
  opens: boolean;
  links: boolean;
  label?: string;
}

export interface SendEmailOptions {
  account_id: string;
  subject: string;
  body: string;
  to: EmailAttendee[];
  cc?: EmailAttendee[];
  bcc?: EmailAttendee[];
  from?: EmailAttendee;
  reply_to?: string;
  tracking_options?: EmailTrackingOptions;
  custom_headers?: Array<{
    name: string;
    value: string;
  }>;
}