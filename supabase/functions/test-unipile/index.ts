import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const unipileDsn = Deno.env.get('UNIPILE_DSN')
    const unipileApiKey = Deno.env.get('UNIPILE_API_KEY')

    if (!unipileDsn || !unipileApiKey) {
      throw new Error('Missing Unipile configuration')
    }

    console.log('Testing Unipile connection...')

    const response = await fetch(`${unipileDsn}/accounts`, {
      headers: {
        'Authorization': `Bearer ${unipileApiKey}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Unipile API error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Successfully retrieved accounts:', data)

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error testing Unipile connection:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})