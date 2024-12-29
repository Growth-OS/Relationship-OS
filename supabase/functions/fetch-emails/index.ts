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
      throw connError;
    }

    if (!connection) {
      throw new Error('No Google connection found');
    }

    console.log("Found OAuth connection, fetching emails from Unipile...");

    // Fetch emails from Unipile
    const unipileResponse = await fetch(`${Deno.env.get('UNIPILE_DSN')}/api/v1/emails?account_id=${user.id}&limit=50`, {
      headers: {
        'X-API-KEY': Deno.env.get('UNIPILE_API_KEY')!,
        'Accept': 'application/json'
      }
    });

    if (!unipileResponse.ok) {
      const error = await unipileResponse.text();
      console.error("Unipile API error:", error);
      throw new Error(`Failed to fetch emails: ${error}`);
    }

    const emails = await unipileResponse.json();
    console.log("Successfully fetched emails from Unipile");

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