import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const UNIPILE_DSN = Deno.env.get('UNIPILE_DSN');
    const UNIPILE_API_KEY = Deno.env.get('UNIPILE_API_KEY');

    if (!UNIPILE_DSN || !UNIPILE_API_KEY) {
      throw new Error('Missing required environment variables');
    }

    // Ensure proper URL format
    const unipileBaseUrl = UNIPILE_DSN?.includes('://')
      ? UNIPILE_DSN
      : `https://${UNIPILE_DSN}`;

    console.log('Using Unipile base URL:', unipileBaseUrl);

    const { chatId } = await req.json().catch(() => ({}));

    const headers = {
      'X-API-KEY': UNIPILE_API_KEY,
      'accept': 'application/json',
    };

    // First, trigger a sync
    console.log('Triggering sync...');
    try {
      const syncResponse = await fetch(`${unipileBaseUrl}/api/v1/chats/sync`, {
        method: 'POST',
        headers,
      });

      if (!syncResponse.ok) {
        const errorText = await syncResponse.text();
        console.error('Sync failed:', errorText);
        throw new Error(`Sync failed with status ${syncResponse.status}: ${errorText}`);
      }

      console.log('Sync successful');
    } catch (error) {
      console.error('Error during sync:', error);
      throw new Error(`Failed to sync messages: ${error.message}`);
    }

    if (chatId) {
      // Get messages for a specific chat
      console.log(`Fetching messages for chat ${chatId}`);
      const messagesUrl = `${unipileBaseUrl}/api/v1/chats/${chatId}/messages`;
      const response = await fetch(messagesUrl, { headers });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to fetch messages: ${errorText}`);
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Messages response:', data);

      // Ensure we have a valid response structure
      if (!data || typeof data !== 'object') {
        console.error('Invalid response data:', data);
        throw new Error('Invalid response data structure');
      }

      // Handle both array and object with items property
      const messageItems = Array.isArray(data) ? data : (data.items || []);
      
      const messages = messageItems.map(msg => ({
        id: msg.id,
        text: msg.content || '',
        sender_name: msg.sender_name || 'Unknown',
        sender_profile_url: msg.sender_profile_url,
        sender_avatar_url: msg.sender_avatar_url,
        received_at: msg.received_at || new Date().toISOString(),
        is_outbound: !!msg.is_outbound
      }));

      return new Response(
        JSON.stringify(messages),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all chats
    console.log('Fetching all chats');
    const chatsUrl = `${unipileBaseUrl}/api/v1/chats`;
    const response = await fetch(chatsUrl, { headers });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch chats: ${errorText}`);
      throw new Error(`Failed to fetch chats: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Chats response:', data);

    if (!data || typeof data !== 'object') {
      console.error('Invalid chats response data:', data);
      throw new Error('Invalid chats response data structure');
    }

    const chatItems = data.items || [];
    if (!Array.isArray(chatItems)) {
      console.error('Chats items is not an array:', chatItems);
      throw new Error('Invalid chats data structure');
    }

    const chats = chatItems.map(chat => ({
      id: chat.id,
      sender_name: chat.sender_name || 'Unknown',
      sender_profile_url: chat.sender_profile_url,
      sender_avatar_url: chat.sender_avatar_url,
      text: chat.snippet || '',
      received_at: chat.last_message_at || new Date().toISOString(),
      unread_count: chat.unread_count || 0
    }));

    return new Response(
      JSON.stringify({ items: chats }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});