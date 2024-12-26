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
            content: `You are a professional grammar and style checker. Review the text for:
            1. Grammar errors
            2. Spelling mistakes
            3. Punctuation issues
            4. Style improvements
            5. Word choice suggestions

            For each issue found, return an object with:
            - "original": the exact text that needs correction
            - "suggested": your suggested correction

            Format your response as a JSON object with a "corrections" array.
            Example response:
            {
              "corrections": [
                {"original": "their going", "suggested": "they're going"},
                {"original": "affect", "suggested": "effect"}
              ]
            }

            If no issues are found, return: {"corrections": []}`
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
      const content = data.choices[0].message.content;
      console.log('Parsed content:', content);
      const parsed = JSON.parse(content);
      corrections = parsed.corrections || [];
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