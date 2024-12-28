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
      const message = {
        user_id: userId,
        external_id: data.id,
        source: 'email',
        sender_name: data.from?.name || data.from?.email || 'Unknown Sender',
        sender_email: data.from?.email,
        sender_avatar_url: data.from?.avatar_url,
        content: data.content || data.snippet || 'No content available',
        subject: data.subject || 'No subject',
        received_at: data.date || new Date().toISOString(),
        is_read: data.is_read || false,
        is_archived: data.is_archived || false,
        is_starred: data.is_starred || false,
        thread_id: data.thread_id,
        labels: data.labels,
        metadata: {
          ...data.metadata,
          email_specific: {
            cc: data.cc,
            bcc: data.bcc,
            attachments: data.attachments,
          }
        }
      };

      const { error: upsertError } = await supabase
        .from('unified_messages')
        .upsert(message, {
          onConflict: ['external_id', 'user_id']
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
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});