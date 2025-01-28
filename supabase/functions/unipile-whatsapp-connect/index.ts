import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const UNIPILE_API_KEY = Deno.env.get('UNIPILE_API_KEY')
const UNIPILE_DSN = Deno.env.get('UNIPILE_DSN')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate environment variables
    if (!UNIPILE_API_KEY || !UNIPILE_DSN) {
      throw new Error('Missing required environment variables')
    }

    console.log('Initializing WhatsApp connection request...')
    
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

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Unipile API error:', errorData)
      throw new Error('Failed to generate QR code')
    }

    const data = await response.json()
    console.log('Successfully generated WhatsApp QR code')

    return new Response(
      JSON.stringify({
        qrCode: data.qrCode,
        sessionId: data.sessionId
      }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in WhatsApp connection:', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred while connecting to WhatsApp'
      }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500,
      },
    )
  }
})