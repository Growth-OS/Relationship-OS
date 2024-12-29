import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const UNIPILE_API_KEY = Deno.env.get('UNIPILE_API_KEY')!;
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;

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
    const { accountId } = await req.json();
    console.log("Registering webhook for account:", accountId);
    
    if (!UNIPILE_API_KEY) {
      throw new Error('UNIPILE_API_KEY is not set');
    }

    if (!WEBHOOK_SECRET) {
      throw new Error('WEBHOOK_SECRET is not set');
    }
    
    const webhookUrl = `${SUPABASE_URL}/functions/v1/email-webhook`;
    console.log("Webhook URL:", webhookUrl);
    
    // Register webhook with Unipile
    const response = await fetch('https://api.unipile.com/v1/webhooks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${UNIPILE_API_KEY}`
      },
      body: JSON.stringify({
        account_id: accountId,
        url: webhookUrl,
        secret: WEBHOOK_SECRET,
        events: ['mail.created', 'mail.updated'],
      })
    });

    const responseText = await response.text();
    console.log('Unipile API Response:', responseText);

    if (!response.ok) {
      console.error('Error registering webhook:', responseText);
      throw new Error(`Failed to register webhook: ${responseText}`);
    }

    const webhook = response.headers.get('content-type')?.includes('application/json') 
      ? JSON.parse(responseText)
      : { message: responseText };
      
    console.log('Webhook registered successfully:', webhook);

    return new Response(JSON.stringify({ success: true, webhook }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});