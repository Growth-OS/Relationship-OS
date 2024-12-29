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

    // Ensure UNIPILE_DSN starts with https://
    const unipileDsn = UNIPILE_DSN?.startsWith('https://') 
      ? UNIPILE_DSN 
      : `https://${UNIPILE_DSN}`;

    const url = new URL(req.url);
    const chatId = url.searchParams.get('chatId');

    const headers = {
      'X-API-KEY': UNIPILE_API_KEY,
      'accept': 'application/json',
    };

    if (chatId) {
      // Get messages for a specific chat
      console.log(`Fetching messages for chat ${chatId}`);
      const response = await fetch(
        `${unipileDsn}/api/v1/chats/${chatId}/messages`,
        { headers }
      );
      const data = await response.json();
      console.log(`Retrieved ${data?.length || 0} messages`);

      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all chats
    console.log('Fetching all chats');
    const response = await fetch(
      `${unipileDsn}/api/v1/chats`,
      { headers }
    );
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