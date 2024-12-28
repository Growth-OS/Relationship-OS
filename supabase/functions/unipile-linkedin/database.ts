import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";
import { UnipileWebhookEvent } from './types.ts';

export const storeMessage = async (
  supabase: ReturnType<typeof createClient>,
  userId: string,
  message: {
    id: string;
    sender: { name: string; profile_url?: string; avatar_url?: string; };
    content: string;
    chat_id: string;
    created_at: string;
    direction: 'inbound' | 'outbound';
  }
) => {
  const { error: insertError } = await supabase
    .from('linkedin_messages')
    .upsert({
      user_id: userId,
      unipile_message_id: message.id,
      sender_name: message.sender.name,
      sender_profile_url: message.sender.profile_url,
      sender_avatar_url: message.sender.avatar_url,
      content: message.content,
      thread_id: message.chat_id,
      received_at: message.created_at,
      is_outbound: message.direction === 'outbound'
    }, {
      onConflict: 'unipile_message_id'
    });

  if (insertError) {
    console.error('Error upserting message:', insertError);
    throw insertError;
  }
};

export const handleWebhookMessage = async (
  supabase: ReturnType<typeof createClient>,
  event: UnipileWebhookEvent
) => {
  // TODO: Implement chat_id to user_id mapping
  // For now, we'll need to handle this limitation
  console.log('Processing webhook message:', event.message_id);
  
  const { error: insertError } = await supabase
    .from('linkedin_messages')
    .insert({
      unipile_message_id: event.message_id,
      sender_name: event.sender.attendee_name,
      sender_profile_url: event.sender.attendee_profile_url,
      content: event.message,
      thread_id: event.chat_id,
      received_at: event.timestamp,
      is_outbound: false,
      // We'll need to get the user_id from the chat_id mapping
      // For now, this will fail due to the NOT NULL constraint
      user_id: null 
    });

  if (insertError) {
    console.error('Error inserting webhook message:', insertError);
    throw insertError;
  }
};