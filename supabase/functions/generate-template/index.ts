import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { params } = await req.json();
    
    const systemPrompt = `You are an expert in writing engaging ${params.stepType} messages for B2B outreach sequences.
    You specialize in creating messages that are personalized, value-focused, and drive responses.
    
    Guidelines:
    - Keep the message concise and focused
    - Include a clear value proposition
    - Address specific pain points
    - End with a soft call to action
    - Maintain a ${params.tone} tone
    - Adapt the style based on being step ${params.stepNumber} in the sequence
    `;

    const userPrompt = `Create a ${params.stepType} message for step ${params.stepNumber} of an outreach sequence.
    
    Industry: ${params.industry}
    Target Role: ${params.targetRole}
    Value Proposition: ${params.valueProposition}
    Pain Points: ${params.painPoints}
    
    The message should:
    1. Be appropriate for the step number (${params.stepNumber})
    2. Maintain a ${params.tone} tone
    3. Include personalization elements
    4. Focus on value and pain points
    5. End with an appropriate call to action`;

    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!perplexityApiKey) {
      throw new Error('Perplexity API key not configured');
    }

    console.log('Generating template with Perplexity...');
    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!perplexityResponse.ok) {
      const errorText = await perplexityResponse.text();
      console.error('Perplexity API error:', errorText);
      throw new Error(`Perplexity API error: ${errorText}`);
    }

    const aiResponse = await perplexityResponse.json();
    const generatedTemplate = aiResponse.choices[0].message.content;

    console.log('Template generated successfully');

    return new Response(
      JSON.stringify({ generatedTemplate }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in generate-template function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});