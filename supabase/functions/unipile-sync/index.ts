import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const unipileApiKey = Deno.env.get('UNIPILE_API_KEY');
    if (!unipileApiKey) {
      throw new Error('UNIPILE_API_KEY is not set');
    }

    // Get user ID from request
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      req.headers.get('Authorization')?.split('Bearer ')[1] || ''
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Fetch messages from Unipile
    const response = await fetch('https://api.unipile.com/v1/messages/list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${unipileApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Unipile API error: ${response.statusText}`);
    }

    const messages = await response.json();
    console.log('Fetched messages from Unipile:', messages);

    // Transform and insert messages
    const transformedMessages = messages.data.map((msg: any) => ({
      user_id: user.id,
      source: msg.source.toLowerCase(),
      external_id: msg.id,
      sender_name: msg.from.name || 'Unknown',
      sender_email: msg.from.email,
      sender_phone: msg.from.phone,
      sender_avatar_url: msg.from.avatar_url,
      content: msg.content || msg.snippet || '',
      subject: msg.subject,
      received_at: msg.date,
      thread_id: msg.thread_id,
      metadata: msg
    }));

    // Insert messages into unified_messages table
    const { error: insertError } = await supabase
      .from('unified_messages')
      .upsert(
        transformedMessages,
        { 
          onConflict: 'external_id',
          ignoreDuplicates: true 
        }
      );

    if (insertError) {
      throw insertError;
    }

    return new Response(
      JSON.stringify({ success: true, count: transformedMessages.length }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});