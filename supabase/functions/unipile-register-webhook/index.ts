import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const UNIPILE_API_KEY = Deno.env.get('UNIPILE_API_KEY');
    const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');

    if (!UNIPILE_API_KEY || !WEBHOOK_SECRET || !SUPABASE_URL) {
      throw new Error('Missing required environment variables');
    }

    console.log('Registering webhook with Unipile...');

    const webhookUrl = `${SUPABASE_URL}/functions/v1/email-webhook`;
    console.log('Webhook URL:', webhookUrl);

    const response = await fetch('https://api.unipile.com/v1/webhooks/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${UNIPILE_API_KEY}`,
      },
      body: JSON.stringify({
        url: webhookUrl,
        secret: WEBHOOK_SECRET,
        events: ['email.received', 'email.updated'],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to register webhook:', errorText);
      throw new Error(`Failed to register webhook: ${errorText}`);
    }

    const data = await response.json();
    console.log('Webhook registered successfully:', data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in webhook registration:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});