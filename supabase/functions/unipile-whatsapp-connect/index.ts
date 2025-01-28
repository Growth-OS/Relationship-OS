import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from "../_shared/cors.ts"

const UNIPILE_API_KEY = Deno.env.get('UNIPILE_API_KEY')
const UNIPILE_DSN = Deno.env.get('UNIPILE_DSN')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Unipile client
    const unipileUrl = `${UNIPILE_DSN}/v1`
    
    // Request QR code from Unipile
    const response = await fetch(`${unipileUrl}/account/whatsapp/connect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${UNIPILE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate QR code')
    }

    return new Response(
      JSON.stringify({ qrCode: data.qrCode, sessionId: data.sessionId }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})