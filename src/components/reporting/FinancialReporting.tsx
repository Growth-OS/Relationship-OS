import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Financial Analytics</h2>
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              €{totals.totalIncome.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              €{totals.totalExpenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totals.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              €{totals.netIncome.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => `€${value.toFixed(2)}`}
                  labelStyle={{ color: '#666' }}
                />
                <Bar dataKey="income" name="Income" fill="#22c55e" />
                <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
                <Bar dataKey="net" name="Net" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};