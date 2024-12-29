import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const UNIPILE_DSN = Deno.env.get("UNIPILE_DSN");
const UNIPILE_API_KEY = Deno.env.get("UNIPILE_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!UNIPILE_DSN || !UNIPILE_API_KEY) {
      throw new Error("Missing required environment variables");
    }

    const { to, subject, body, replyTo } = await req.json();
    console.log("Sending email with data:", { to, subject, replyTo });

    // Ensure UNIPILE_DSN has the correct protocol
    const unipileDsn = UNIPILE_DSN.startsWith('https://') ? UNIPILE_DSN : `https://${UNIPILE_DSN}`;
    
    // Create form data
    const formData = new FormData();
    formData.append("account_id", "kzAxdybMQ7ipVxK1U6kwZw"); // Add the account_id
    formData.append("subject", subject);
    formData.append("body", body);
    formData.append("to", JSON.stringify(to));

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
    
    const response = await fetch(`${unipileDsn}/api/v1/emails`, {
      method: "POST",
      headers: {
        "X-API-KEY": UNIPILE_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Unipile API error:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const result = await response.json();
    console.log("Email sent successfully:", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});