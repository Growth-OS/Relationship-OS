import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    console.log('Received webhook request');
    
    // Verify webhook secret
    const webhookSecret = req.headers.get('x-webhook-secret');
    console.log('Webhook secret received:', webhookSecret ? 'Yes' : 'No');
    
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
    console.log('Received webhook payload:', JSON.stringify(payload, null, 2));
    
    // Process new email
    const emailData = {
      message_id: payload.message_id,
      user_id: payload.account_id,
      from_email: payload.from_attendee.identifier,
      from_name: payload.from_attendee.display_name,
      to_emails: payload.to_attendees.map((a: any) => a.identifier),
      cc_emails: payload.cc_attendees?.map((a: any) => a.identifier) || [],
      bcc_emails: payload.bcc_attendees?.map((a: any) => a.identifier) || [],
      subject: payload.subject,
      body: payload.body,
      snippet: payload.body_plain?.substring(0, 200),
      received_at: payload.date,
      has_attachments: payload.has_attachments,
      folder: payload.folders[0] || 'inbox',
      created_at: new Date().toISOString()
    };

    console.log('Processing email data:', JSON.stringify(emailData, null, 2));

    const { error: upsertError } = await supabase
      .from('emails')
      .upsert(emailData, {
        onConflict: 'message_id,user_id'
      });

    if (upsertError) {
      console.error('Error upserting email:', upsertError);
      throw upsertError;
    }
    
    console.log('Email processed successfully');

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