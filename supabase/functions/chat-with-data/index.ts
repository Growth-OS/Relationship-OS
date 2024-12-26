import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';
import { handleFinancialData } from './handlers/financialHandler.ts';
import { handleTaskData } from './handlers/taskHandler.ts';
import { handleDealData } from './handlers/dealHandler.ts';
import { handleAffiliateData } from './handlers/affiliateHandler.ts';
import { handleSubstackData } from './handlers/substackHandler.ts';
import { handleProspectData } from './handlers/prospectHandler.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    const contextData: Record<string, any> = {};

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all relevant data based on message content
    if (isFinancialQuery(message)) {
      await handleFinancialData(supabase, userId, contextData);
    }

    if (isTaskQuery(message)) {
      await handleTaskData(supabase, userId, contextData);
    }

    if (isDealQuery(message)) {
      await handleDealData(supabase, userId, contextData);
    }

    if (isAffiliateQuery(message)) {
      await handleAffiliateData(supabase, userId, contextData);
    }

    if (isSubstackQuery(message)) {
      await handleSubstackData(supabase, userId, contextData);
    }

    if (isProspectQuery(message)) {
      await handleProspectData(supabase, userId, contextData);
    }

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
            content: `You are an AI assistant for Growth OS, a business growth platform. Use UK English spelling and formatting. Format responses following these guidelines:

1. Financial Data Formatting:
   - Use clean headings without special characters
   - Present amounts in UK format: £1,234.56
   - Use emojis sparingly and professionally:
     💰 for income totals
     💳 for expense totals
     📊 for summaries
   - Use proper spacing and indentation
   - Format dates as DD/MM/YYYY
   - Use "turnover" instead of "revenue"
   - Present category breakdowns in a clean list format

2. Task and Deal Formatting:
   - Present tasks in a clear, bulleted list
   - Show deal values in UK format
   - Format deadlines and due dates clearly
   - Use priority indicators consistently

3. Content and Substack Formatting:
   - Show post titles in quotation marks
   - Format publication dates clearly
   - Present engagement metrics in a structured way

4. General Formatting Guidelines:
   - Use bullet points (•) for lists
   - Keep responses concise and well-structured
   - Use proper spacing between sections
   - Maintain professional tone
   - Use UK spelling and terminology
   - Format numbers with proper thousand separators

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

// Helper functions to determine query type
const isFinancialQuery = (message: string): boolean => {
  const keywords = ['financ', 'money', 'transaction', 'expense', 'income', 'spent', 'earned', 'payment', 'invoice', 'budget'];
  return keywords.some(keyword => message.toLowerCase().includes(keyword));
};

const isTaskQuery = (message: string): boolean => {
  const keywords = ['task', 'todo', 'to-do', 'deadline', 'due', 'priority'];
  return keywords.some(keyword => message.toLowerCase().includes(keyword));
};

const isDealQuery = (message: string): boolean => {
  const keywords = ['deal', 'pipeline', 'client', 'prospect', 'opportunity', 'sales'];
  return keywords.some(keyword => message.toLowerCase().includes(keyword));
};

const isAffiliateQuery = (message: string): boolean => {
  const keywords = ['affiliate', 'commission', 'earning', 'partner', 'referral'];
  return keywords.some(keyword => message.toLowerCase().includes(keyword));
};

const isSubstackQuery = (message: string): boolean => {
  const keywords = ['substack', 'post', 'article', 'newsletter', 'content', 'publish'];
  return keywords.some(keyword => message.toLowerCase().includes(keyword));
};

const isProspectQuery = (message: string): boolean => {
  const keywords = ['prospect', 'lead', 'contact', 'potential', 'opportunity'];
  return keywords.some(keyword => message.toLowerCase().includes(keyword));
};