import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { UnipileClient } from 'npm:unipile-node-sdk';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) throw new Error('Invalid user token');

    // Initialize Unipile client
    const unipileClient = new UnipileClient(
      Deno.env.get('UNIPILE_DSN')!,
      Deno.env.get('UNIPILE_API_KEY')!
    );

    // Get messages from all connected services
    const messages = await unipileClient.messaging.getAllMessages();

    // Store messages in unified_messages table
    const { error: insertError } = await supabase
      .from('unified_messages')
      .upsert(
        messages.map(msg => ({
          user_id: user.id,
          source: msg.source,
          external_id: msg.id,
          sender_name: msg.sender?.name || 'Unknown',
          sender_email: msg.sender?.email,
          sender_avatar_url: msg.sender?.avatar_url,
          content: msg.content,
          subject: msg.subject,
          received_at: msg.timestamp,
          thread_id: msg.thread_id,
          metadata: msg
        })),
        { onConflict: 'external_id' }
      );

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ success: true, count: messages.length }),
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