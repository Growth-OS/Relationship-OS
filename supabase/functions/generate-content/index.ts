import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { prompt, title } = await req.json();

    console.log('Starting content generation request');
    console.log('Title:', title);
    console.log('Prompt length:', prompt?.length || 0);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    // Construct a detailed prompt for the AI
    const systemPrompt = `You are a professional content writer creating a blog post. 
    Write engaging, well-structured content that maintains a conversational yet professional tone.
    Focus on providing value to readers while incorporating relevant examples and insights.`;

    const userPrompt = `Write a blog post titled "${title}". 
    Additional context: ${prompt || 'Write an informative and engaging post on this topic.'}
    
    Make sure the content is:
    1. Well-structured with clear sections
    2. Engaging and conversational
    3. Informative and valuable to readers
    4. Around 800-1000 words`;

    console.log('Sending request to OpenAI API...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    console.log('OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error details:', errorData);
      throw new Error(errorData.error?.message || 'Failed to generate content');
    }

    const data = await response.json();
    console.log('Successfully received OpenAI response');
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid OpenAI response format:', data);
      throw new Error('Invalid response format from OpenAI');
    }

    const generatedText = data.choices[0].message.content;
    console.log('Content generation completed successfully');

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});