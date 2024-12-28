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
    console.log('Received mail tracking webhook:', body);

    const { event, data, userId } = body;

    // Handle different tracking events
    if (event.startsWith('email.tracking.')) {
      const messageId = data.message_id;
      const trackingEvent = event.replace('email.tracking.', '');
      const timestamp = new Date().toISOString();

      // Update the message metadata with tracking information
      const { data: message, error: fetchError } = await supabase
        .from('unified_messages')
        .select('metadata')
        .eq('external_id', messageId)
        .eq('user_id', userId)
        .single();

      if (fetchError) throw fetchError;

      const updatedMetadata = {
        ...message.metadata,
        tracking: {
          ...(message.metadata?.tracking || {}),
          [trackingEvent]: {
            timestamp,
            ...data
          }
        }
      };

      const { error: updateError } = await supabase
        .from('unified_messages')
        .update({ 
          metadata: updatedMetadata,
        })
        .eq('external_id', messageId)
        .eq('user_id', userId);

      if (updateError) throw updateError;
      console.log(`Mail tracking event ${trackingEvent} processed successfully`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing mail tracking webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});