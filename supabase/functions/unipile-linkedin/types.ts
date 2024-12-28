export interface UnipileWebhookEvent {
  account_id: string;
  account_type: string;
  event: 'message_received' | 'message_reaction' | 'message_read';
  chat_id: string;
  timestamp: string;
  webhook_name: string;
  message_id: string;
  message: string;
  sender: {
    attendee_id: string;
    attendee_name: string;
    attendee_provider_id: string;
    attendee_profile_url: string;
  };
  attendees: Array<{
    attendee_id: string;
    attendee_name: string;
    attendee_provider_id: string;
    attendee_profile_url: string;
  }>;
  attachments?: {
    id: string;
    size?: {
      height: string;
      width: string;
    };
    sticker: string;
    unavailable: string;
    mimetype: string;
    type: string;
    url: string;
  };
  reaction?: string;
  reaction_sender?: {
    attendee_id: string;
    attendee_name: string;
    attendee_provider_id: string;
    attendee_profile_url: string;
  };
}

export interface UnipileHeaders {
  'X-API-KEY': string;
  'Accept': string;
  'Content-Type': string;
  'User-Agent': string;
}