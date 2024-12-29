import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface EmailAttendee {
  identifier: string;
  display_name: string | null;
}

interface NewEmailWebhookPayload {
  email_id: string;
  account_id: string;
  event: 'mail_received' | 'mail_sent';
  webhook_name: string;
  date: string;
  from_attendee: EmailAttendee;
  to_attendees: EmailAttendee[];
  bcc_attendees: EmailAttendee[];
  cc_attendees: EmailAttendee[];
  reply_to_attendees: EmailAttendee[];
  provider_id: string;
  message_id: string;
  has_attachments: boolean;
  subject: string | null;
  body: string;
  body_plain: string;
  attachments: any[];
  folders: string[];
  role: string;
  read_date: string | null;
  is_complete: boolean;
  tracking_id?: string;
  origin: 'unipile' | 'external';
}

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
    // Verify webhook secret
    const webhookSecret = req.headers.get('x-webhook-secret');
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

    const emailPayload = payload as NewEmailWebhookPayload;
    
    // Process new email
    const emailData = {
      message_id: emailPayload.message_id,
      user_id: emailPayload.account_id,
      from_email: emailPayload.from_attendee.identifier,
      from_name: emailPayload.from_attendee.display_name,
      to_emails: emailPayload.to_attendees.map(a => a.identifier),
      cc_emails: emailPayload.cc_attendees.map(a => a.identifier),
      bcc_emails: emailPayload.bcc_attendees.map(a => a.identifier),
      subject: emailPayload.subject,
      body: emailPayload.body,
      received_at: emailPayload.date,
      has_attachments: emailPayload.has_attachments,
      folder: emailPayload.folders[0] || 'inbox',
      tracking_id: emailPayload.tracking_id
    };

    const { error: upsertError } = await supabase
      .from('emails')
      .upsert(emailData, {
        onConflict: 'message_id,user_id'
      });

    if (upsertError) {
      console.error('Error upserting email:', upsertError);
      throw upsertError;
    }
    
    console.log(`Email ${payload.event} processed successfully`);

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