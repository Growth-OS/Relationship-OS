import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    console.log("Fetching Unipile accounts");
    
    const unipileApiKey = Deno.env.get('UNIPILE_API_KEY');
    if (!unipileApiKey) {
      throw new Error('UNIPILE_API_KEY not found');
    }

    const response = await fetch('https://api8.unipile.com:13814/api/v1/accounts', {
      method: 'GET',
      headers: {
        'X-API-KEY': unipileApiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Unipile API error:', errorText);
      throw new Error(`Unipile API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Successfully fetched Unipile accounts");
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});