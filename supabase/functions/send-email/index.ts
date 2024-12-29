import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const UNIPILE_DSN = Deno.env.get("UNIPILE_DSN");
const UNIPILE_API_KEY = Deno.env.get("UNIPILE_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: { identifier: string }[];
  subject: string;
  body: string;
  replyTo?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!UNIPILE_DSN || !UNIPILE_API_KEY) {
      throw new Error("Missing required environment variables");
    }

    const { to, subject, body, replyTo } = await req.json() as EmailRequest;
    console.log("Sending email with data:", { to, subject, replyTo });

    // Ensure UNIPILE_DSN has the correct protocol
    const unipileDsn = UNIPILE_DSN.startsWith('https://') ? UNIPILE_DSN : `https://${UNIPILE_DSN}`;
    
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("body", body);
    formData.append("to", JSON.stringify(to));
    
    if (replyTo) {
      formData.append("reply_to", replyTo);
    }

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