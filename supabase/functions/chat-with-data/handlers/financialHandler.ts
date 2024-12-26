import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

export async function handleFinancialData(
  supabase: SupabaseClient,
  userId: string,
  contextData: any
) {
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