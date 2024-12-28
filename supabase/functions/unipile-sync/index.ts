import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get auth user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false
        }
      }
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      throw new Error('Invalid user token')
    }

    // Fetch messages from Unipile
    const unipileKey = Deno.env.get('UNIPILE_API_KEY')
    if (!unipileKey) {
      throw new Error('Missing Unipile API key')
    }

    console.log('Fetching messages from Unipile...')
    
    const response = await fetch('https://api.unipile.com/v1/messages', {
      headers: {
        'Authorization': `Bearer ${unipileKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Unipile API error: ${response.status} ${response.statusText}`)
    }

    const messages = await response.json()
    console.log(`Fetched ${messages.length} messages from Unipile`)

    // Insert messages into Supabase
    const { error: insertError } = await supabaseClient
      .from('unified_messages')
      .upsert(
        messages.map((msg: any) => ({
          user_id: user.id,
          source: msg.source,
          external_id: msg.id,
          sender_name: msg.sender?.name || 'Unknown',
          sender_email: msg.sender?.email,
          sender_avatar_url: msg.sender?.avatar_url,
          content: msg.content,
          subject: msg.subject,
          received_at: msg.received_at,
          thread_id: msg.thread_id,
          metadata: msg
        })),
        { onConflict: 'external_id' }
      )

    if (insertError) {
      throw insertError
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in unipile-sync function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})