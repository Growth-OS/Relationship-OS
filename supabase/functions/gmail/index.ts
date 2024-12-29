import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const UNIPILE_API_KEY = Deno.env.get("UNIPILE_API_KEY");
const UNIPILE_DSN = Deno.env.get("UNIPILE_DSN");

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
    if (!UNIPILE_API_KEY || !UNIPILE_DSN) {
      throw new Error("Missing required environment variables");
    }

    const { action } = await req.json();
    console.log("Gmail action:", action);

    // Ensure UNIPILE_DSN has the correct protocol
    const unipileDsn = UNIPILE_DSN.startsWith('https://') ? UNIPILE_DSN : `https://${UNIPILE_DSN}`;

    if (action === 'get_auth_url') {
      const response = await fetch(`${unipileDsn}/api/v1/oauth/gmail/url`, {
        method: 'GET',
        headers: {
          'X-API-KEY': UNIPILE_API_KEY,
        },
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Failed to get auth URL:", error);
        throw new Error(`Failed to get auth URL: ${error}`);
      }

      const data = await response.json();
      console.log("Got auth URL:", data);

      return new Response(JSON.stringify({ url: data.url }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error("Invalid action");
  } catch (error) {
    console.error("Error in gmail function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});