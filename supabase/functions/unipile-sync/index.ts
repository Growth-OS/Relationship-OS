import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting message sync...');
    
    const unipileApiKey = Deno.env.get('UNIPILE_API_KEY');
    if (!unipileApiKey) {
      throw new Error('UNIPILE_API_KEY not found');
    }

    // Get user from auth header
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    console.log('Fetching messages for user:', user.id);

    // Fetch messages from Unipile
    const response = await fetch('https://api6.unipile.com:13619/api/v1/messages?limit=50', {
      headers: {
        'X-API-KEY': unipileApiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Unipile API error:', errorText);
      throw new Error(`Unipile API error: ${response.status}`);
    }

    const messages = await response.json();
    console.log(`Fetched ${messages.items?.length || 0} messages from Unipile`);

    // Process and store messages
    if (messages.items && messages.items.length > 0) {
      const formattedMessages = messages.items.map((msg: any) => ({
        user_id: user.id,
        external_id: msg.id,
        source: msg.source?.toLowerCase() || 'email',
        sender_name: msg.from?.name || msg.from?.email || 'Unknown Sender',
        sender_email: msg.from?.email,
        sender_phone: msg.from?.phone,
        sender_avatar_url: msg.from?.avatar_url,
        content: msg.content || msg.snippet || 'No content available',
        subject: msg.subject || 'No subject',
        received_at: msg.date || new Date().toISOString(),
        is_read: msg.is_read || false,
        is_archived: msg.is_archived || false,
        thread_id: msg.thread_id,
        labels: msg.labels,
        metadata: msg.metadata
      }));

      const { error: insertError } = await supabase.from('unified_messages').upsert(
        formattedMessages,
        {
          onConflict: ['external_id', 'user_id']
        }
      );

      if (insertError) {
        console.error('Error inserting messages:', insertError);
        throw insertError;
      }

      console.log('Messages sync completed successfully');
    } else {
      console.log('No messages found to sync');
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Messages synced successfully',
        count: messages.items?.length || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in unipile-sync function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});