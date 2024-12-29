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

    const headers = {
      'X-API-KEY': UNIPILE_API_KEY,
      'accept': 'application/json',
      'Content-Type': 'application/json',
    };

    const { chatId } = await req.json().catch(() => ({}));

    // First, trigger a sync for LinkedIn messages specifically
    console.log('Triggering sync for LinkedIn messages...');
    try {
      const syncResponse = await fetch(`${unipileBaseUrl}/api/v1/messages/sync`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          provider: 'linkedin',
        }),
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
      const messagesUrl = `${unipileBaseUrl}/api/v1/messages`;
      const response = await fetch(messagesUrl, { 
        method: 'GET',
        headers,
      });
      
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
      
      const messages = messageItems
        .filter(msg => msg.thread_id === chatId)
        .map(msg => ({
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
    const chatsUrl = `${unipileBaseUrl}/api/v1/messages`;
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

    // Group messages by thread_id to create chat list
    const messageItems = Array.isArray(data) ? data : (data.items || []);
    const chatMap = new Map();

    messageItems.forEach(msg => {
      if (!msg.thread_id) return;
      
      if (!chatMap.has(msg.thread_id)) {
        chatMap.set(msg.thread_id, {
          id: msg.thread_id,
          sender_name: msg.sender_name || 'Unknown',
          sender_profile_url: msg.sender_profile_url,
          sender_avatar_url: msg.sender_avatar_url,
          text: msg.content || '',
          received_at: msg.received_at || new Date().toISOString(),
          unread_count: msg.status === 'unread' ? 1 : 0
        });
      } else if (msg.status === 'unread') {
        const chat = chatMap.get(msg.thread_id);
        chat.unread_count += 1;
      }
    });

    const chats = Array.from(chatMap.values());
    
    return new Response(
      JSON.stringify({ items: chats }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in linkedin-messages function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});