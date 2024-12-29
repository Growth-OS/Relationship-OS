import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const { message, userId } = await req.json();
    console.log('Received request:', { message, userId });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const [tasks, meetings, emails] = await Promise.all([
      // Get pending tasks
      supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', false)
        .order('due_date', { ascending: true })
        .limit(5),
      
      // Get upcoming meetings from oauth_connections
      supabase
        .from('oauth_connections')
        .select('*')
        .eq('user_id', userId)
        .eq('provider', 'google')
        .maybeSingle(),
      
      // Get unread emails
      supabase
        .from('emails')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('received_at', { ascending: false })
        .limit(5)
    ]);

    console.log('Fetched context:', { tasks: tasks.data, hasMeetings: !!meetings.data, emails: emails.data });

    let contextPrompt = '';
    
    // Add tasks context
    if (tasks.data && tasks.data.length > 0) {
      contextPrompt += `\nPending tasks:\n${tasks.data.map(task => 
        `- ${task.title}${task.due_date ? ` (due: ${task.due_date})` : ''}`
      ).join('\n')}`;
    }

    // Add meetings context
    if (meetings.data) {
      contextPrompt += '\nCalendar is connected.';
    }

    // Add emails context
    if (emails.data && emails.data.length > 0) {
      contextPrompt += `\nUnread emails: ${emails.data.length}`;
    }

    // Prepare the system prompt
    const systemPrompt = `You are a helpful AI assistant focused on productivity and task management. 
You have access to real-time information and can browse the web to provide accurate answers.
Your responses should be clear, concise, and action-oriented.
Current user context:${contextPrompt}`;

    // Clean up response text by removing citations and references
    const cleanResponse = (text: string) => {
      return text
        // Remove numbered citations [1], [2], etc.
        .replace(/\[\d+\]/g, '')
        // Remove reference lists that might appear at the end
        .replace(/References:[\s\S]*$/i, '')
        // Remove any remaining square brackets with numbers
        .replace(/\[(\d+,?\s?)+\]/g, '')
        // Clean up any double spaces created by removing citations
        .replace(/\s+/g, ' ')
        // Clean up any spaces before punctuation
        .replace(/\s+([.,!?])/g, '$1')
        .trim();
    };

    console.log('Calling Perplexity API with system prompt:', systemPrompt);

    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('PERPLEXITY_API_KEY')}`,
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
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        stream: false
      }),
    });

    if (!perplexityResponse.ok) {
      const errorData = await perplexityResponse.text();
      console.error('Perplexity API error:', errorData);
      throw new Error(`Perplexity API error: ${errorData}`);
    }

    const data = await perplexityResponse.json();
    console.log('Perplexity response received:', data);

    // Clean the response before sending it back
    const cleanedContent = cleanResponse(data.choices[0].message.content);

    return new Response(
      JSON.stringify({ response: cleanedContent }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in chat-with-data function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      },
    );
  }
});
