import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface EmailTrackingWebhookPayload {
  event: 'mail_link_clicked' | 'mail_opened';
  event_id: string;
  tracking_id: string;
  date: string;
  email_id: string;
  account_id: string;
  ip: string;
  user_agent: string;
  url?: string;
  label?: string;
  custom_domain?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify webhook secret
    const webhookSecret = req.headers.get('x-webhook-secret');
    if (webhookSecret !== Deno.env.get('WEBHOOK_SECRET')) {
      console.error('Invalid webhook secret received');
      return new Response(
        JSON.stringify({ error: 'Invalid webhook secret' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const payload = await req.json();
    console.log('Received tracking webhook payload:', JSON.stringify(payload, null, 2));

    const trackingPayload = payload as EmailTrackingWebhookPayload;
    
    // Process tracking event
    const trackingData = {
      email_id: trackingPayload.email_id,
      user_id: trackingPayload.account_id,
      event_type: trackingPayload.event,
      occurred_at: trackingPayload.date,
      ip_address: trackingPayload.ip,
      user_agent: trackingPayload.user_agent,
      url: trackingPayload.url
    };

    const { error: trackingError } = await supabase
      .from('email_tracking')
      .insert(trackingData);

    if (trackingError) {
      console.error('Error inserting tracking event:', trackingError);
      throw trackingError;
    }

    console.log(`Email tracking event ${payload.event} processed successfully`);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
});