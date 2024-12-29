import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const UNIPILE_DSN = Deno.env.get('UNIPILE_DSN');
const UNIPILE_API_KEY = Deno.env.get('UNIPILE_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Format the Unipile DSN correctly
    const unipileBaseUrl = UNIPILE_DSN?.includes('://')
      ? UNIPILE_DSN
      : `https://${UNIPILE_DSN}:13619`;

    console.log('Using Unipile base URL:', unipileBaseUrl);

    const url = new URL(req.url);
    const { chatId } = await req.json().catch(() => ({}));

    const headers = {
      'X-API-KEY': UNIPILE_API_KEY,
      'accept': 'application/json',
    };

    if (chatId) {
      // Get messages for a specific chat
      console.log(`Fetching messages for chat ${chatId}`);
      const messagesUrl = `${unipileBaseUrl}/api/v1/chats/${chatId}/messages`;
      console.log('Messages URL:', messagesUrl);
      
      const response = await fetch(messagesUrl, { headers });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching messages:', errorText);
        throw new Error(`Failed to fetch messages: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`Retrieved ${data?.length || 0} messages`);

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all chats
    console.log('Fetching all chats');
    const chatsUrl = `${unipileBaseUrl}/api/v1/chats`;
    console.log('Chats URL:', chatsUrl);
    
    const response = await fetch(chatsUrl, { headers });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching chats:', errorText);
      throw new Error(`Failed to fetch chats: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`Retrieved ${data?.length || 0} chats`);

    return new Response(
      JSON.stringify(data),
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