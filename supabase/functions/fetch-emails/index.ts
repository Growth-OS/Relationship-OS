import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the JWT token from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Verify the JWT token and get the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid token');
    }

    console.log("Fetching emails for user:", user.id);

    // Get the user's OAuth connection
    const { data: connection, error: connError } = await supabase
      .from('oauth_connections')
      .select('*')
      .eq('provider', 'google')
      .eq('user_id', user.id)
      .maybeSingle();

    if (connError) {
      console.error("Error checking OAuth connection:", connError);
      throw connError;
    }

    if (!connection) {
      console.log("No Google connection found");
      return new Response(
        JSON.stringify({ items: [] }),
        { headers: corsHeaders }
      );
    }

    const unipileDsn = Deno.env.get('UNIPILE_DSN');
    const unipileApiKey = Deno.env.get('UNIPILE_API_KEY');

    if (!unipileDsn || !unipileApiKey) {
      throw new Error('Missing Unipile configuration');
    }

    console.log("Fetching emails from Unipile with account_id:", user.id);

    // Fetch emails from Unipile with proper parameters
    const unipileResponse = await fetch(`${unipileDsn}/api/v1/emails?account_id=${user.id}&limit=50&meta_only=false`, {
      headers: {
        'X-API-KEY': unipileApiKey,
        'Accept': 'application/json'
      }
    });

    if (!unipileResponse.ok) {
      const errorText = await unipileResponse.text();
      console.error("Unipile API error:", errorText);
      throw new Error(`Failed to fetch emails: ${errorText}`);
    }

    const emails = await unipileResponse.json();
    console.log("Successfully fetched emails from Unipile:", {
      count: emails.items?.length || 0,
      cursor: emails.cursor
    });

    // Store emails in Supabase for caching
    if (emails.items?.length > 0) {
      const { error: insertError } = await supabase
        .from('emails')
        .upsert(
          emails.items.map((email: any) => ({
            user_id: user.id,
            message_id: email.id,
            conversation_id: email.conversation_id,
            from_email: email.from_attendee.identifier,
            from_name: email.from_attendee.display_name,
            to_emails: email.to_attendees.map((a: any) => a.identifier),
            cc_emails: email.cc_attendees?.map((a: any) => a.identifier) || [],
            bcc_emails: email.bcc_attendees?.map((a: any) => a.identifier) || [],
            subject: email.subject,
            body: email.body,
            snippet: email.body_plain?.substring(0, 200),
            received_at: email.date,
            has_attachments: email.has_attachments,
            folder: email.folders[0] || 'inbox',
            created_at: new Date().toISOString()
          })),
          { onConflict: 'message_id,user_id' }
        );

      if (insertError) {
        console.error("Error caching emails:", insertError);
      }
    }

    return new Response(
      JSON.stringify(emails),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
});