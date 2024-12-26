import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional grammar checker focusing on British English. 
            Analyze the text for grammar, style, and clarity issues.
            Return a JSON array of corrections with 'original' and 'suggested' fields.
            Focus on British English conventions and formal writing style.
            If there are no issues, return an empty array.`
          },
          {
            role: 'user',
            content: text
          }
        ],
      }),
    });

    const data = await openAIResponse.json();
    const analysis = JSON.parse(data.choices[0].message.content);
    
    return new Response(
      JSON.stringify({
        hasIssues: analysis.length > 0,
        corrections: analysis
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error in grammar check:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});