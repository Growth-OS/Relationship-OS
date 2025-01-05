import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useEffect } from "react";

export const FinancialOverview = () => {
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions-overview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
        .lte('date', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString());
      
      if (error) throw error;
      return data;
    },
  });

  // Set up real-time subscription for transactions
  useEffect(() => {
    const channel = supabase
      .channel('financial-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'financial_transactions'
        },
        () => {
          // Invalidate and refetch when transactions change
          queryClient.invalidateQueries({ queryKey: ['transactions-overview'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const totalIncome = transactions
    ?.filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const totalExpenses = transactions
    ?.filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

  const netIncome = totalIncome - totalExpenses;

  if (isLoading) {
    return <div>Loading financial overview...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <ArrowUpIcon className="h-4 w-4 text-green-500" />
          <h3 className="text-sm font-medium">Monthly Income</h3>
        </div>
        <p className="text-2xl font-bold">€{totalIncome.toFixed(2)}</p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2">
          <ArrowDownIcon className="h-4 w-4 text-red-500" />
          <h3 className="text-sm font-medium">Monthly Expenses</h3>
        </div>
        <p className="text-2xl font-bold">€{totalExpenses.toFixed(2)}</p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Net Income</h3>
        </div>
        <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          €{netIncome.toFixed(2)}
        </p>
      </Card>
    </div>
  );
};