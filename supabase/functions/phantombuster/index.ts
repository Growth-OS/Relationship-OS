import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, scriptId, linkedinUrl } = await req.json()
    const apiKey = Deno.env.get('PHANTOMBUSTER_API_KEY')
    const baseUrl = 'https://api.phantombuster.com/api/v2'

    if (!apiKey) {
      throw new Error('Phantombuster API key not found')
    }

    // Get auth user from request
    const authHeader = req.headers.get('Authorization')?.split(' ')[1]
    if (!authHeader) throw new Error('No authorization header')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!supabaseUrl || !supabaseKey) throw new Error('Supabase credentials not found')
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader)
    if (userError || !user) throw new Error('Invalid user')

    switch (action) {
      case 'listScripts': {
        const response = await fetch(`${baseUrl}/agents`, {
          headers: {
            'X-Phantombuster-Key': apiKey,
          },
        })
        const data = await response.json()
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      case 'runPostLikers': {
        if (!linkedinUrl) {
          throw new Error('LinkedIn URL is required')
        }

        // Launch the Post Likers script with the provided URL
        const response = await fetch(`${baseUrl}/agents/launch`, {
          method: 'POST',
          headers: {
            'X-Phantombuster-Key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: scriptId,
            argument: {
              postUrl: linkedinUrl,
              // Add any other required parameters for the script
            },
          }),
        })

        const launchData = await response.json()
        
        // Wait for the script to complete (you might want to implement a better waiting mechanism)
        await new Promise(resolve => setTimeout(resolve, 30000))

        // Fetch the results
        const resultsResponse = await fetch(`${baseUrl}/agents/fetch-output`, {
          method: 'POST',
          headers: {
            'X-Phantombuster-Key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: scriptId,
            containerId: launchData.containerId,
          }),
        })

        const results = await resultsResponse.json()
        
        // Process the results and add them to prospects
        if (results && results.data) {
          const prospects = Array.isArray(results.data) ? results.data : [results.data]
          
          for (const prospect of prospects) {
            // Add each prospect to the database
            await supabase.from('prospects').insert({
              user_id: user.id,
              company_name: prospect.companyName || 'Unknown Company',
              contact_job_title: prospect.jobTitle || null,
              source: 'linkedin',
              notes: `Found via LinkedIn post: ${linkedinUrl}`,
              status: 'active',
            })
          }
        }

        return new Response(JSON.stringify({ success: true, results }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})