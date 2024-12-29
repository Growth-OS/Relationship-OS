import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-secret',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  // Handle CORS preflight requests
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

    const body = await req.json();
    console.log('Received webhook payload:', JSON.stringify(body, null, 2));

    const { event, email_id, account_id, date, from_attendee, to_attendees, subject, body: emailBody, has_attachments, folders, tracking_id } = body;

    switch (event) {
      case 'mail_received':
      case 'mail_sent': {
        // Process new email
        const emailData = {
          message_id: email_id,
          user_id: account_id,
          from_email: from_attendee.identifier,
          from_name: from_attendee.display_name,
          to_emails: to_attendees.map((a: any) => a.identifier),
          subject: subject,
          body: emailBody,
          received_at: date,
          has_attachments: has_attachments,
          folder: folders?.[0] || 'inbox',
          tracking_id: tracking_id
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
        
        console.log(`Email ${event} processed successfully`);
        break;
      }

      case 'mail_opened':
      case 'mail_link_clicked': {
        // Process tracking event
        const trackingData = {
          email_id: email_id,
          user_id: account_id,
          event_type: event,
          occurred_at: date,
          ip_address: body.ip,
          user_agent: body.user_agent,
          url: body.url // Only for mail_link_clicked
        };

        const { error: trackingError } = await supabase
          .from('email_tracking')
          .insert(trackingData);

        if (trackingError) {
          console.error('Error inserting tracking event:', trackingError);
          throw trackingError;
        }

        console.log(`Email tracking event ${event} processed successfully`);
        break;
      }

      default:
        console.warn(`Unhandled webhook event type: ${event}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});