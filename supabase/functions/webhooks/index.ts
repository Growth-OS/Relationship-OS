import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

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
    const expectedSecret = Deno.env.get('Zapier');
    
    console.log('Received headers:', Object.fromEntries(req.headers.entries()));
    console.log('Received webhook secret:', webhookSecret);
    console.log('Expected secret:', expectedSecret);
    console.log('Headers match:', webhookSecret === expectedSecret);

    if (webhookSecret !== expectedSecret) {
      console.log('Secret validation failed');
      return new Response(
        JSON.stringify({ 
          error: 'Invalid webhook secret',
          message: 'The provided webhook secret does not match the expected value',
          received_length: webhookSecret?.length,
          expected_length: expectedSecret?.length
        }),
        { 
          status: 401, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const body = await req.json();
    const { type, data, userId } = body;

    console.log('Received webhook:', { type, data });

    switch (type) {
      case 'prospect':
        const { error: prospectError } = await supabase
          .from('prospects')
          .insert({
            ...data,
            user_id: userId,
            source: data.source || 'other',
          });

        if (prospectError) throw prospectError;
        break;

      case 'deal':
        const { error: dealError } = await supabase
          .from('deals')
          .insert({
            ...data,
            user_id: userId,
            stage: data.stage || 'lead',
            deal_value: data.deal_value || 0,
            last_activity_date: new Date().toISOString(),
          });

        if (dealError) throw dealError;
        break;

      case 'task':
        const { error: taskError } = await supabase
          .from('tasks')
          .insert({
            ...data,
            user_id: userId,
            source: data.source || 'other',
          });

        if (taskError) throw taskError;
        break;

      default:
        throw new Error(`Unsupported webhook type: ${type}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});