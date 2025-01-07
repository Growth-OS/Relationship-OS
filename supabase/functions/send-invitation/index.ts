import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from 'https://esm.sh/resend@2.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    
    // Get request body
    const { email, teamId, role, invitedBy, token } = await req.json()
    
    if (!email || !teamId || !role || !token) {
      console.error('Missing required fields:', { email, teamId, role, token })
      throw new Error('Missing required fields')
    }

    // Send the invitation email
    const inviteUrl = `${req.headers.get('origin')}/join?token=${token}`
    
    console.log('Sending invitation email to:', email)
    const { data, error: emailError } = await resend.emails.send({
      from: 'Team Invitations <onboarding@resend.dev>',
      to: email,
      subject: `You've been invited to join a team`,
      html: `
        <h2>Team Invitation</h2>
        <p>You've been invited by ${invitedBy} to join the team as a ${role}.</p>
        <p>Click the link below to accept the invitation:</p>
        <a href="${inviteUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Accept Invitation</a>
        <p>This invitation will expire in 7 days.</p>
      `,
    })

    if (emailError) {
      console.error('Error sending email:', emailError)
      throw emailError
    }

    console.log('Invitation email sent successfully')
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