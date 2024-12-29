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
    const { message, userId } = await req.json();
    console.log('Received request:', { message, userId });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch user's context data
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
Your responses should be clear, concise, and action-oriented.
Current user context:${contextPrompt}`;

    console.log('Calling OpenAI with system prompt:', systemPrompt);

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ]
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData}`);
    }

    const aiData = await openAIResponse.json();
    console.log('OpenAI response received:', aiData);

    if (!aiData.choices || !aiData.choices[0] || !aiData.choices[0].message) {
      console.error('Unexpected OpenAI response structure:', aiData);
      throw new Error('Invalid response from OpenAI API');
    }

    return new Response(
      JSON.stringify({ response: aiData.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );

  } catch (error) {
    console.error('Error in chat-with-data function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});