import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify webhook secret
    const webhookSecret = req.headers.get('x-webhook-secret');
    if (webhookSecret !== Deno.env.get('WEBHOOK_SECRET')) {
      return new Response(
        JSON.stringify({ error: 'Invalid webhook secret' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const body = await req.json();
    console.log('Received email webhook payload:', body);

    const { event, data, userId } = body;

    if (event === 'email.received' || event === 'email.updated') {
      const emailData = {
        user_id: userId,
        message_id: data.id,
        from_email: data.from?.email || 'Unknown Sender',
        subject: data.subject || 'No subject',
        snippet: data.snippet,
        body: data.content,
        received_at: data.date || new Date().toISOString(),
        is_read: data.is_read || false,
        is_archived: data.is_archived || false,
        is_starred: data.is_starred || false,
        is_trashed: data.is_trashed || false,
        is_sent: data.is_sent || false,
      };

      const { error: upsertError } = await supabase
        .from('emails')
        .upsert(emailData, {
          onConflict: 'message_id,user_id'
        });

      if (upsertError) throw upsertError;
      console.log(`Email ${event} processed successfully`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing email webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});