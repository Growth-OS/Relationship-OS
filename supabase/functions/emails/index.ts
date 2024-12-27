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
    // Log the incoming webhook secret for debugging
    const webhookSecret = req.headers.get('x-webhook-secret');
    const expectedSecret = Deno.env.get('WEBHOOK_SECRET');
    
    console.log('Received webhook secret:', webhookSecret);
    console.log('Expected webhook secret:', expectedSecret);
    console.log('Headers received:', Object.fromEntries(req.headers.entries()));

    if (webhookSecret !== expectedSecret) {
      console.error('Webhook secret mismatch!');
      return new Response(
        JSON.stringify({ error: 'Invalid webhook secret' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const emailData = await req.json();
    console.log('Received email data:', emailData);

    // Validate required fields
    const requiredFields = ['from', 'subject'];
    const missingFields = requiredFields.filter(field => !emailData[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return new Response(
        JSON.stringify({ error: `Missing required fields: ${missingFields.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user_id from the request headers or query params
    const user_id = emailData.user_id;
    if (!user_id) {
      console.error('No user_id provided in the request');
      return new Response(
        JSON.stringify({ error: 'user_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate a unique message ID if not provided
    const messageId = emailData.id || crypto.randomUUID();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Store email in database
    const { error: insertError } = await supabase
      .from('emails')
      .insert({
        message_id: messageId,
        from_email: emailData.from,
        subject: emailData.subject,
        snippet: emailData.snippet || emailData.subject,
        body: emailData.body,
        received_at: emailData.date || new Date().toISOString(),
        user_id: user_id
      });

    if (insertError) {
      console.error('Error inserting email:', insertError);
      throw insertError;
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