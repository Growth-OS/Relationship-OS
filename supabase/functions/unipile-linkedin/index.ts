import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const UNIPILE_API_KEY = Deno.env.get('UNIPILE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

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
    const { action, messageId, content } = await req.json();
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Verify the user's JWT
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid user token');
    }

    const unipileHeaders = {
      'Authorization': `Bearer ${UNIPILE_API_KEY}`,
      'Content-Type': 'application/json',
    };

    switch (action) {
      case 'getMessages': {
        const response = await fetch('https://api.unipile.com/v1/linkedin/messages', {
          headers: unipileHeaders,
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.statusText}`);
        }

        const messages = await response.json();
        
        // Store messages in Supabase
        for (const msg of messages.data) {
          await supabaseAdmin
            .from('linkedin_messages')
            .upsert({
              user_id: user.id,
              unipile_message_id: msg.id,
              sender_name: msg.sender.name,
              sender_profile_url: msg.sender.profile_url,
              sender_avatar_url: msg.sender.avatar_url,
              content: msg.content,
              thread_id: msg.thread_id,
              received_at: msg.received_at,
              is_outbound: msg.is_outbound,
            }, {
              onConflict: 'user_id,unipile_message_id'
            });
        }

        return new Response(JSON.stringify(messages), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'sendMessage': {
        if (!messageId || !content) {
          throw new Error('Missing messageId or content');
        }

        const response = await fetch('https://api.unipile.com/v1/linkedin/messages', {
          method: 'POST',
          headers: unipileHeaders,
          body: JSON.stringify({
            thread_id: messageId,
            content: content,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to send message: ${response.statusText}`);
        }

        const result = await response.json();
        
        // Store the sent message in Supabase
        await supabaseAdmin
          .from('linkedin_messages')
          .insert({
            user_id: user.id,
            unipile_message_id: result.data.id,
            sender_name: 'You',
            content: content,
            thread_id: messageId,
            received_at: new Date().toISOString(),
            is_outbound: true,
          });

        return new Response(JSON.stringify(result), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});