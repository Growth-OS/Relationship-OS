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
    
    console.log('Request Headers:', Object.fromEntries(req.headers.entries()));
    
    if (webhookSecret !== expectedSecret) {
      console.log('Secret validation failed:', {
        received: webhookSecret,
        expected: expectedSecret,
        receivedLength: webhookSecret?.length,
        expectedLength: expectedSecret?.length
      });
      
      return new Response(
        JSON.stringify({ 
          error: 'Invalid webhook secret',
          message: 'The provided webhook secret does not match the expected value'
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const rawBody = await req.text();
    console.log('Raw request body:', rawBody);
    
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      console.log('JSON parse error:', e);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON',
          message: 'The request body must be valid JSON',
          receivedBody: rawBody
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Parsed webhook payload:', body);

    // Validate required fields
    if (!body.type) {
      console.log('Missing type in payload:', body);
      return new Response(
        JSON.stringify({ 
          error: 'Missing type',
          message: 'The type field is required in the webhook payload',
          supportedTypes: ['prospect', 'deal', 'task'],
          receivedPayload: body
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!body.data || !body.userId) {
      console.log('Missing required fields:', { data: body.data, userId: body.userId });
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields',
          message: 'Both data and userId are required fields',
          receivedPayload: body
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { type, data, userId } = body;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log('Processing webhook:', { type, data });

    switch (type) {
      case 'prospect':
        if (!data.company_name) {
          return new Response(
            JSON.stringify({ 
              error: 'Missing company_name',
              message: 'company_name is required for prospect type',
              receivedData: data
            }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        const { error: prospectError } = await supabase
          .from('prospects')
          .insert({
            ...data,
            user_id: userId,
            source: data.source || 'other',
          });

        if (prospectError) {
          console.error('Supabase error:', prospectError);
          throw prospectError;
        }
        break;

      case 'deal':
        if (!data.company_name) {
          return new Response(
            JSON.stringify({ 
              error: 'Missing company_name',
              message: 'company_name is required for deal type',
              receivedData: data
            }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
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
          return new Response(
            JSON.stringify({ 
              error: 'Missing title',
              message: 'title is required for task type',
              receivedData: data
            }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
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
        return new Response(
          JSON.stringify({ 
            error: 'Invalid type',
            message: `Unsupported webhook type: ${type}. Supported types are: prospect, deal, task`,
            receivedType: type
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
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
        details: 'An unexpected error occurred while processing the webhook',
        debug: {
          errorName: error.name,
          errorStack: error.stack
        }
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});