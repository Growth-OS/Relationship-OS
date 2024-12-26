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
            Your task is to analyze the text and return ONLY a JSON array of corrections.
            Each correction should be an object with exactly these fields:
            - "original": the original text that needs correction
            - "suggested": the suggested correction
            Do not include any markdown formatting or explanation.
            If there are no issues, return an empty array.
            Example response for text with issues: [{"original": "their", "suggested": "they're"}]
            Example response for text without issues: []`
          },
          {
            role: 'user',
            content: text
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const data = await openAIResponse.json();
    console.log('OpenAI response:', data);
    
    let corrections = [];
    try {
      // The content should already be JSON since we specified response_format
      corrections = JSON.parse(data.choices[0].message.content).corrections || [];
    } catch (parseError) {
      console.error('Error parsing corrections:', parseError);
      corrections = [];
    }
    
    return new Response(
      JSON.stringify({
        hasIssues: corrections.length > 0,
        corrections: corrections
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