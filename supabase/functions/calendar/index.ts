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
    console.log("Calendar function called");
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (userError || !user) {
      console.error("User error:", userError);
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
      console.log("Token expired, refreshing...");
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

    // Fetch calendar events
    const timeMin = new Date();
    timeMin.setDate(timeMin.getDate() - 7); // Last 7 days
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + 30); // Next 30 days

    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin.toISOString()}&timeMax=${timeMax.toISOString()}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          Authorization: `Bearer ${connection.access_token}`,
        },
      }
    );

    if (!calendarResponse.ok) {
      const errorText = await calendarResponse.text();
      console.error("Calendar API error:", errorText);
      throw new Error(`Calendar API error: ${errorText}`);
    }

    const calendarData = await calendarResponse.json();
    console.log(`Fetched ${calendarData.items?.length ?? 0} calendar events`);

    return new Response(JSON.stringify(calendarData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});