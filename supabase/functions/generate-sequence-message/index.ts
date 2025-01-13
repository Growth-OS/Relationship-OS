import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

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
    const { template, prospectData, stepType } = await req.json();
    console.log('Generating message for:', { template, prospectData, stepType });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the user ID from the authorization header
    const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
    if (userError || !user) {
      throw userError || new Error('User not found');
    }

    // Use Perplexity API for message generation
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!perplexityApiKey) {
      throw new Error('Perplexity API key not configured');
    }

    const systemPrompt = `You are an expert in writing ${stepType} messages for B2B outreach sequences.
    You specialize in creating messages that are personalized, value-focused, and drive responses.
    
    Guidelines:
    - Keep the message concise and focused
    - Include a clear value proposition
    - Address specific pain points
    - End with a soft call to action
    - Maintain a professional tone
    - Replace all placeholders with natural, contextual content
    `;

    const userPrompt = `Generate a personalized ${stepType} message using this template and prospect data:

    Template:
    ${template}

    Prospect Data:
    ${Object.entries(prospectData)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n')}

    Replace all placeholders (e.g. {{First Name}}) with the corresponding data and ensure the message flows naturally.`;

    console.log('Calling Perplexity API...');
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
    const generatedMessage = aiResponse.choices[0].message.content;

    console.log('Message generated successfully');

    return new Response(
      JSON.stringify({ generatedMessage }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in generate-sequence-message function:', error);
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