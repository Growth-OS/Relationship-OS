import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const UNIPILE_DSN = Deno.env.get("UNIPILE_DSN");
const UNIPILE_API_KEY = Deno.env.get("UNIPILE_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  accountId: string;
  to: { display_name?: string; identifier: string }[];
  subject: string;
  body: string;
  replyTo?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accountId, to, subject, body, replyTo } = await req.json() as EmailRequest;

    const formData = new FormData();
    formData.append("account_id", accountId);
    formData.append("subject", subject);
    formData.append("body", body);
    formData.append("to", JSON.stringify(to));
    
    if (replyTo) {
      formData.append("reply_to", replyTo);
    }

    console.log("Sending email with data:", { accountId, to, subject, replyTo });

    const response = await fetch(`${UNIPILE_DSN}/api/v1/emails`, {
      method: "POST",
      headers: {
        "X-API-KEY": UNIPILE_API_KEY!,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Error sending email:", error);
      throw new Error(`Failed to send email: ${error}`);
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