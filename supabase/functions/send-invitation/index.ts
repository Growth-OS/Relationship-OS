import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, teamId, role, invitedBy } = await req.json()
    const token = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // Token expires in 24 hours

    // Store the invitation token
    const { error: inviteError } = await supabase
      .from('team_invitations')
      .insert({
        email,
        team_id: teamId,
        role,
        token,
        expires_at: expiresAt.toISOString(),
      })

    if (inviteError) throw inviteError

    // Send the invitation email
    const inviteUrl = `${req.headers.get('origin')}/join?token=${token}`
    
    const { error: emailError } = await resend.emails.send({
      from: 'Team Invitations <onboarding@resend.dev>',
      to: email,
      subject: `You've been invited to join a team`,
      html: `
        <h2>Team Invitation</h2>
        <p>You've been invited by ${invitedBy} to join their team as a ${role}.</p>
        <p>Click the link below to accept the invitation:</p>
        <a href="${inviteUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Accept Invitation</a>
        <p>This invitation will expire in 24 hours.</p>
      `,
    })

    if (emailError) throw emailError

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error sending invitation:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})