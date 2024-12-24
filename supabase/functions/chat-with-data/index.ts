import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch relevant data based on the message content
    let contextData = {};

    if (message.toLowerCase().includes('task') || message.toLowerCase().includes('todo')) {
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', false)
        .order('due_date', { ascending: true });
      contextData.tasks = tasks;
    }

    if (message.toLowerCase().includes('deal') || message.toLowerCase().includes('pipeline')) {
      const { data: deals } = await supabase
        .from('deals')
        .select('*')
        .eq('user_id', userId);
      contextData.deals = deals;
    }

    // Call OpenAI API with enhanced formatting instructions
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
            content: `You are an AI assistant for Growth OS, a business growth platform. Format your responses following these guidelines:

1. For Tasks:
   - List tasks in bullet points
   - Include due dates in [brackets]
   - Mark priority tasks with 🔥
   - Format overdue tasks in **bold**

2. For Deals:
   - Present deal values in a clear format: $1,234.56
   - Group deals by stage
   - Show pipeline total at the bottom
   - Use 📈 for increasing values, 📉 for decreasing

3. For Metrics:
   - Use tables for comparing data
   - Include % changes where relevant
   - Round large numbers appropriately
   - Use emojis for status indicators (✅ ❌ ⚠️)

4. General Formatting:
   - Use markdown for emphasis
   - Keep responses concise and structured
   - Use bullet points for lists
   - Add relevant emojis for better visualization

Current context data: ${JSON.stringify(contextData)}`,
          },
          { role: 'user', content: message },
        ],
      }),
    });

    const aiData = await openAIResponse.json();
    const response = aiData.choices[0].message.content;

    return new Response(
      JSON.stringify({ response, contextData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});