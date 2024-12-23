import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const PHANTOMBUSTER_API_KEY = Deno.env.get('PHANTOMBUSTER_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_ANON_KEY!
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      req.headers.get('Authorization')?.split(' ')[1] || ''
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { action, scriptId, linkedinUrl } = await req.json()

    if (action === 'listScripts') {
      console.log('Fetching scripts with API key:', PHANTOMBUSTER_API_KEY ? 'Present' : 'Missing')
      
      // First, get all agents
      const response = await fetch('https://api.phantombuster.com/api/v2/agents/fetch-all', {
        headers: {
          'X-Phantombuster-Key': PHANTOMBUSTER_API_KEY!,
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Failed to fetch scripts:', response.status, errorText)
        throw new Error(`Failed to fetch scripts: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      console.log('Raw response:', JSON.stringify(data))
      
      // Filter for LinkedIn-related scripts
      const scripts = data.data.filter((script: any) => 
        script.name.toLowerCase().includes('linkedin') &&
        (script.name.toLowerCase().includes('liker') || 
         script.name.toLowerCase().includes('commenter'))
      ).map((script: any) => ({
        id: script.id,
        name: script.name,
        description: script.manifest?.description || 'No description available',
        lastEndTime: script.lastEndTime,
      }))

      console.log('Filtered scripts:', scripts)

      return new Response(JSON.stringify({ data: scripts }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'runPostLikers' && scriptId && linkedinUrl) {
      // Launch the script
      const launchResponse = await fetch(`https://api.phantombuster.com/api/v2/agents/launch`, {
        method: 'POST',
        headers: {
          'X-Phantombuster-Key': PHANTOMBUSTER_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: scriptId,
          argument: {
            postUrl: linkedinUrl,
            sessionCookie: "your-linkedin-session-cookie", // This should be configured per user
          },
        }),
      })

      if (!launchResponse.ok) {
        throw new Error('Failed to launch script')
      }

      const result = await launchResponse.json()

      // Wait for a few seconds to get initial results
      await new Promise(resolve => setTimeout(resolve, 5000))

      // Fetch the results
      const resultsResponse = await fetch(`https://api.phantombuster.com/api/v2/agents/fetch-output?id=${scriptId}`, {
        headers: {
          'X-Phantombuster-Key': PHANTOMBUSTER_API_KEY!,
        },
      })

      if (!resultsResponse.ok) {
        throw new Error('Failed to fetch results')
      }

      const results = await resultsResponse.json()

      // Add results to prospects table
      if (results.data && Array.isArray(results.data)) {
        for (const profile of results.data) {
          await supabase.from('prospects').insert({
            user_id: user.id,
            company_name: profile.companyName || 'Unknown',
            contact_job_title: profile.jobTitle,
            source: 'linkedin',
            notes: `Liked/commented on post: ${linkedinUrl}`,
          })
        }
      }

      return new Response(JSON.stringify({ success: true, data: results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('Invalid action')

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})