import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { format, subMonths } from "date-fns";
import { FinancialSummaryCard } from "./financial/FinancialSummaryCard";
import { MonthlyOverviewChart } from "./financial/MonthlyOverviewChart";

export const FinancialReporting = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('financial_transactions')
        .select('*')
        .gte('date', subMonths(new Date(), 11).toISOString())
        .lte('date', new Date().toISOString())
        .order('date');

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Get unique categories from transactions
  const categories = [...new Set(transactions.map(t => t.category))].filter(Boolean);

  // Calculate monthly totals
  const monthlyData = transactions.reduce((acc: any[], transaction) => {
    const monthKey = format(new Date(transaction.date), 'MMM yyyy');
    const existingMonth = acc.find(item => item.month === monthKey);

    if (existingMonth) {
      if (transaction.type === 'income') {
        existingMonth.income += Number(transaction.amount);
      } else {
        existingMonth.expenses += Number(transaction.amount);
      }
      existingMonth.net = existingMonth.income - existingMonth.expenses;
    } else {
      acc.push({
        month: monthKey,
        income: transaction.type === 'income' ? Number(transaction.amount) : 0,
        expenses: transaction.type === 'expense' ? Number(transaction.amount) : 0,
        net: transaction.type === 'income' ? Number(transaction.amount) : -Number(transaction.amount),
      });
    }
    return acc;
  }, []);

  // Calculate totals
  const totals = transactions.reduce(
    (acc, transaction) => {
      const amount = Number(transaction.amount);
      if (transaction.type === 'income') {
        acc.totalIncome += amount;
      } else {
        acc.totalExpenses += amount;
      }
      acc.netIncome = acc.totalIncome - acc.totalExpenses;
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0, netIncome: 0 }
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Financial Analytics
        </h2>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FinancialSummaryCard
          title="Total Income"
          amount={totals.totalIncome}
          type="income"
        />
        <FinancialSummaryCard
          title="Total Expenses"
          amount={totals.totalExpenses}
          type="expenses"
        />
        <FinancialSummaryCard
          title="Net Income"
          amount={totals.netIncome}
          type="net"
        />
      </div>

      <MonthlyOverviewChart data={monthlyData} />
    </div>
  );
};