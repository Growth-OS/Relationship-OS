import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

    const { to, subject, body, replyTo } = await req.json();
    console.log("Received request with data:", { to, subject, replyTo });

    // Ensure UNIPILE_DSN has the correct protocol
    const unipileDsn = UNIPILE_DSN.startsWith('https://') ? UNIPILE_DSN : `https://${UNIPILE_DSN}`;
    
    // First, fetch the user's email accounts
    console.log("Fetching email accounts from Unipile...");
    const accountsResponse = await fetch(`${unipileDsn}/api/v1/accounts?provider=gmail`, {
      headers: {
        'X-API-KEY': UNIPILE_API_KEY,
      },
    });

    if (!accountsResponse.ok) {
      const error = await accountsResponse.text();
      console.error("Failed to fetch accounts:", error);
      throw new Error(`Failed to fetch accounts: ${error}`);
    }

    const accounts = await accountsResponse.json();
    console.log("Fetched accounts:", accounts);

    if (!accounts.length) {
      throw new Error("No email accounts found");
    }

    // Use the first active account
    const accountId = accounts[0].id;
    console.log("Using account ID:", accountId);

    // Create form data
    const formData = new FormData();

    // Add required fields
    formData.append("account_id", accountId);
    formData.append("subject", subject);
    formData.append("body", body);
    
    // Ensure 'to' is properly formatted as a string
    if (Array.isArray(to)) {
      formData.append("to", JSON.stringify(to));
    } else {
      console.error("Invalid 'to' format:", to);
      throw new Error("Invalid 'to' format");
    }

    // Add reply_to if provided
    if (replyTo) {
      formData.append("reply_to", replyTo);
    }

    // Add tracking options
    formData.append("tracking_options", JSON.stringify({
      opens: true,
      links: true
    }));

    console.log("Sending request to Unipile with URL:", `${unipileDsn}/api/v1/emails`);
    console.log("Form data entries:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await fetch(`${unipileDsn}/api/v1/emails`, {
      method: "POST",
      headers: {
        'X-API-KEY': UNIPILE_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Unipile API error:", error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const result = await response.json();
    console.log("Email sent successfully:", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});