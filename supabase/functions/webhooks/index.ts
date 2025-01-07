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
    
    console.log('Webhook Secret Validation:');
    console.log('-------------------------');
    console.log('1. Received secret:', webhookSecret);
    console.log('2. Expected secret:', expectedSecret);
    console.log('3. Secret lengths:', {
      received: webhookSecret?.length || 0,
      expected: expectedSecret?.length || 0
    });
    console.log('4. Secrets match:', webhookSecret === expectedSecret);
    console.log('-------------------------');

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

    const body = await req.json();
    console.log('Received webhook payload:', body);

    // Ensure type is provided in the request body
    if (!body.type) {
      throw new Error('Webhook type is required');
    }

    // Validate required fields based on type
    const { type, data, userId } = body;

    if (!data || !userId) {
      throw new Error('Data and userId are required fields');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log('Processing webhook:', { type, data });

    switch (type) {
      case 'prospect':
        if (!data.company_name) {
          throw new Error('company_name is required for prospect type');
        }
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
        if (!data.company_name) {
          throw new Error('company_name is required for deal type');
        }
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
        if (!data.title) {
          throw new Error('title is required for task type');
        }
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
      JSON.stringify({ 
        error: error.message,
        details: 'Make sure to include "type" in your webhook payload. Supported types are: prospect, deal, task'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});