import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const PHANTOMBUSTER_API_KEY = Deno.env.get('PHANTOMBUSTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, scriptId, arguments: scriptArgs } = await req.json();
    console.log('Phantombuster request:', { action, scriptId });

    if (action === 'listScripts') {
      const response = await fetch('https://api.phantombuster.com/api/v2/agents/fetch-all', {
        headers: {
          'X-Phantombuster-Key': PHANTOMBUSTER_API_KEY!,
        },
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'runScript') {
      const response = await fetch(`https://api.phantombuster.com/api/v2/agents/launch`, {
        method: 'POST',
        headers: {
          'X-Phantombuster-Key': PHANTOMBUSTER_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: scriptId,
          argument: scriptArgs,
        }),
      });
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');
  } catch (error) {
    console.error('Error in phantombuster function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});