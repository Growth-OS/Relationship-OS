export interface Message {
  id: string;
  created_at: string;
  user_id: string;
  source: 'email' | 'whatsapp' | 'linkedin';
  external_id: string;
  sender_name: string;
  sender_email?: string;
  sender_phone?: string;
  sender_avatar_url?: string;
  content: string;
  subject?: string;
  received_at: string;
  is_read: boolean;
  is_archived: boolean;
  is_starred: boolean;
  thread_id?: string;
  labels?: string[];
  metadata?: any;
}