import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let contextData = {};

    // Fetch financial data if the message mentions finances, money, transactions, expenses, or income
    if (message.toLowerCase().includes('financ') || 
        message.toLowerCase().includes('money') || 
        message.toLowerCase().includes('transaction') ||
        message.toLowerCase().includes('expense') ||
        message.toLowerCase().includes('income') ||
        message.toLowerCase().includes('spent') ||
        message.toLowerCase().includes('earned')) {
      
      // Fetch recent transactions
      const { data: transactions } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          transaction_attachments (
            id,
            file_name
          )
        `)
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(10);

      // Calculate financial summaries
      if (transactions) {
        const income = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        const expenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount), 0);

        // Group transactions by category
        const categoryTotals = transactions.reduce((acc, t) => {
          if (!acc[t.category]) acc[t.category] = 0;
          acc[t.category] += Number(t.amount);
          return acc;
        }, {});

        contextData.finances = {
          recentTransactions: transactions,
          summary: {
            totalIncome: income,
            totalExpenses: expenses,
            netAmount: income - expenses,
            categoryTotals
          }
        };
      }
    }

    // Fetch tasks
    if (message.toLowerCase().includes('task') || message.toLowerCase().includes('todo')) {
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', false)
        .order('due_date', { ascending: true });
      contextData.tasks = tasks;
    }

    // Fetch deals
    if (message.toLowerCase().includes('deal') || message.toLowerCase().includes('pipeline')) {
      const { data: deals } = await supabase
        .from('deals')
        .select('*')
        .eq('user_id', userId);
      contextData.deals = deals;
    }

    // Fetch affiliate data
    if (message.toLowerCase().includes('affiliate') || 
        message.toLowerCase().includes('commission') || 
        message.toLowerCase().includes('earning')) {
      const { data: partners } = await supabase
        .from('affiliate_partners')
        .select('*')
        .eq('user_id', userId);
      
      const { data: earnings } = await supabase
        .from('affiliate_earnings')
        .select(`
          *,
          affiliate_partners (
            name,
            program
          )
        `)
        .eq('user_id', userId)
        .order('date', { ascending: false });

      contextData.affiliates = {
        partners: partners || [],
        earnings: earnings || [],
        summary: {
          totalPartners: partners?.length || 0,
          totalEarnings: earnings?.reduce((sum, earning) => sum + Number(earning.amount), 0) || 0,
          recentEarnings: earnings?.slice(0, 5) || []
        }
      };
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
            content: `You are an AI assistant for Growth OS, a business growth platform. You MUST use UK English spelling and formatting (e.g., "organisation" not "organization", "£" for GBP, etc.). Format your responses following these guidelines:

1. For Financial Data:
   - Present amounts in UK format: £1,234.56
   - Group transactions by type (income/expense)
   - Show category breakdowns when relevant
   - Use 💰 for income, 💳 for expenses
   - Format dates in UK style (DD/MM/YYYY)
   - Use "turnover" instead of "revenue"
   - Show net position (profit/loss)

2. For Tasks:
   - List tasks in bullet points with a clear hierarchy
   - Show due dates in clean format: [15/03/2024]
   - Use 🔥 for high priority tasks
   - Style overdue tasks in a visually distinct way
   - Use UK date format (DD/MM/YYYY)

3. For Deals:
   - Present deal values in UK format: £1,234.56
   - Group deals by stage with clear headings
   - Show pipeline total at the bottom
   - Use 📈 for increasing values, 📉 for decreasing
   - Use "enquiry" instead of "inquiry"
   - Use "programme" instead of "program"

4. For Affiliate Data:
   - Show earnings in UK currency format (£)
   - List partners with their commission rates
   - Display monthly and total earnings summaries
   - Use 💰 for earnings and 🤝 for partnerships
   - Format dates in UK style (DD/MM/YYYY)
   - Use "programme" for affiliate programs

5. General Formatting:
   - Use clear visual hierarchy with headings and sections
   - Keep responses concise and well-structured
   - Use bullet points for better readability
   - Add relevant emojis for visual enhancement
   - Always use UK spelling (e.g., "colour", "behaviour", "centre")
   - Use UK terminology (e.g., "turnover" instead of "revenue")
   - Format text for emphasis using spacing and structure

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
