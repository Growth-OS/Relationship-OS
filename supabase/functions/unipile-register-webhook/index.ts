import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const unipileApiKey = Deno.env.get('UNIPILE_API_KEY');
    const webhookSecret = Deno.env.get('WEBHOOK_SECRET');
    
    if (!unipileApiKey || !webhookSecret) {
      throw new Error('Required environment variables are not set');
    }

    // Base URL for your Supabase project's Edge Functions
    const baseUrl = 'https://steunfbcpofecftasvin.supabase.co/functions/v1';

    // Configure webhooks for different types of events
    const webhooks = [
      {
        // LinkedIn messaging webhook
        request_url: `${baseUrl}/linkedin-webhook`,
        name: 'linkedin_messaging_webhook',
        format: 'json',
        enabled: true,
        headers: [
          {
            key: 'x-webhook-secret',
            value: webhookSecret
          }
        ],
        source: 'messaging',
        events: ['message.received', 'message.updated']
      }
    ];

    // Register each webhook with Unipile
    const results = await Promise.all(webhooks.map(async (webhook) => {
      console.log(`Registering webhook: ${webhook.name}`);
      
      const response = await fetch('https://api6.unipile.com:13619/api/v1/webhooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': unipileApiKey,
        },
        body: JSON.stringify(webhook),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error registering ${webhook.name}:`, errorText);
        throw new Error(`Failed to register ${webhook.name}: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log(`Successfully registered ${webhook.name}:`, data);
      return { name: webhook.name, success: true, data };
    }));

    return new Response(
      JSON.stringify({ success: true, results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in webhook registration:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});