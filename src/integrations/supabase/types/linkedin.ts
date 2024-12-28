export interface LinkedInMessage {
  id: string;
  created_at: string;
  user_id: string;
  unipile_message_id: string;
  sender_name: string;
  sender_profile_url: string | null;
  sender_avatar_url: string | null;
  content: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  thread_id: string | null;
  received_at: string;
  is_outbound: boolean;
}