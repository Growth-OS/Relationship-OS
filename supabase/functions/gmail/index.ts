import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const { action } = await req.json();
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (userError || !user) {
      throw new Error("Invalid user");
    }

    const { data: connection, error: connectionError } = await supabase
      .from("oauth_connections")
      .select("*")
      .eq("user_id", user.id)
      .eq("provider", "google")
      .single();

    if (connectionError || !connection) {
      throw new Error("No Google connection found");
    }

    // Check if token is expired and refresh if needed
    if (new Date(connection.expires_at) < new Date()) {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: Deno.env.get("GOOGLE_CLIENT_ID") ?? "",
          client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET") ?? "",
          refresh_token: connection.refresh_token,
          grant_type: "refresh_token",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      await supabase
        .from("oauth_connections")
        .update({
          access_token: data.access_token,
          expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
        })
        .eq("id", connection.id);

      connection.access_token = data.access_token;
    }

    let result;
    switch (action) {
      case "listMessages":
        result = await fetch(
          "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10",
          {
            headers: {
              Authorization: `Bearer ${connection.access_token}`,
            },
          }
        );
        break;
      
      case "getMessage":
        const { messageId } = await req.json();
        result = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
          {
            headers: {
              Authorization: `Bearer ${connection.access_token}`,
            },
          }
        );
        break;

      case "archiveMessage":
        const { messageId: archiveId } = await req.json();
        result = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${archiveId}/modify`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${connection.access_token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              removeLabelIds: ["INBOX"],
            }),
          }
        );
        break;

      default:
        throw new Error("Invalid action");
    }

    const data = await result.json();
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});