import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  teamId: string;
  role: string;
  invitedBy: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY");
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error("Missing Supabase environment variables");
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Get the JWT token from the request header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the JWT token
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Authenticated user:', user.email);

    const invitationRequest: InvitationRequest = await req.json();
    console.log('Sending invitation:', invitationRequest);

    // Get team details
    const { data: team } = await supabase
      .from('teams')
      .select('name')
      .eq('id', invitationRequest.teamId)
      .single();

    if (!team) {
      throw new Error('Team not found');
    }

    // Generate a unique invitation link
    const invitationLink = `${SUPABASE_URL}/join?team=${invitationRequest.teamId}&email=${encodeURIComponent(invitationRequest.email)}`;

    const emailHtml = `
      <h2>You've been invited to join ${team.name}</h2>
      <p>You've been invited by ${invitationRequest.invitedBy} to join the team as a ${invitationRequest.role}.</p>
      <p>Click the button below to accept the invitation:</p>
      <a href="${invitationLink}" style="background-color: #0284c7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">Accept Invitation</a>
      <p>If you didn't expect this invitation, you can safely ignore this email.</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Team Invitations <onboarding@resend.dev>",
        to: [invitationRequest.email],
        subject: `Join ${team.name} on our platform`,
        html: emailHtml,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log('Email sent successfully:', data);

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const error = await res.text();
      console.error('Error from Resend API:', error);
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error("Error in send-invitation function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);