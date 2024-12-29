import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const UNIPILE_API_KEY = Deno.env.get('UNIPILE_API_KEY');
    const UNIPILE_DSN = Deno.env.get('UNIPILE_DSN');
    const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');

    if (!UNIPILE_API_KEY || !WEBHOOK_SECRET || !SUPABASE_URL || !UNIPILE_DSN) {
      throw new Error('Missing required environment variables');
    }

    console.log('Registering webhooks with Unipile...');

    // Register email webhook
    const emailWebhookUrl = `${SUPABASE_URL}/functions/v1/email-webhook`;
    console.log('Email Webhook URL:', emailWebhookUrl);

    const emailWebhookResponse = await fetch(`https://${UNIPILE_DSN}/api/v1/webhooks/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': UNIPILE_API_KEY,
      },
      body: JSON.stringify({
        url: emailWebhookUrl,
        secret: WEBHOOK_SECRET,
        events: ['mail_received', 'mail_sent'],
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json'
          }
        ]
      }),
    });

    if (!emailWebhookResponse.ok) {
      const errorText = await emailWebhookResponse.text();
      console.error('Failed to register email webhook:', errorText);
      throw new Error(`Failed to register email webhook: ${errorText}`);
    }

    // Register tracking webhook
    const trackingWebhookUrl = `${SUPABASE_URL}/functions/v1/mail-tracking`;
    console.log('Tracking Webhook URL:', trackingWebhookUrl);

    const trackingWebhookResponse = await fetch(`https://${UNIPILE_DSN}/api/v1/webhooks/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': UNIPILE_API_KEY,
      },
      body: JSON.stringify({
        url: trackingWebhookUrl,
        secret: WEBHOOK_SECRET,
        events: ['mail_opened', 'mail_link_clicked'],
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json'
          }
        ]
      }),
    });

    if (!trackingWebhookResponse.ok) {
      const errorText = await trackingWebhookResponse.text();
      console.error('Failed to register tracking webhook:', errorText);
      throw new Error(`Failed to register tracking webhook: ${errorText}`);
    }

    const emailWebhookData = await emailWebhookResponse.json();
    const trackingWebhookData = await trackingWebhookResponse.json();

    console.log('Webhooks registered successfully:', {
      emailWebhook: emailWebhookData,
      trackingWebhook: trackingWebhookData
    });

    return new Response(
      JSON.stringify({
        success: true,
        emailWebhook: emailWebhookData,
        trackingWebhook: trackingWebhookData
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error in webhook registration:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});