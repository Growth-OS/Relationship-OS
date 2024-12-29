import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const UNIPILE_API_KEY = Deno.env.get('UNIPILE_API_KEY')!;
const WEBHOOK_SECRET = Deno.env.get('WEBHOOK_SECRET')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;

serve(async (req) => {
  try {
    const { accountId } = await req.json();
    console.log("Registering webhook for account:", accountId);
    
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
        events: ['email.created', 'email.updated'],
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Error registering webhook:', error);
      throw new Error(`Failed to register webhook: ${error}`);
    }

    const webhook = await response.json();
    console.log('Webhook registered successfully:', webhook);

    return new Response(JSON.stringify({ success: true, webhook }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});