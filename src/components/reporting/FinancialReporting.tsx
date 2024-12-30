import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useState } from "react";
import { format, subMonths } from "date-fns";

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

  // Calculate monthly totals with improved data structure
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

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <p className="text-sm">
                <span className="font-medium">{entry.name}: </span>
                <span>€{entry.value.toFixed(2)}</span>
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
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
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              €{totals.totalIncome.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              €{totals.totalExpenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totals.netIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              €{totals.netIncome.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  axisLine={{ stroke: 'currentColor' }}
                />
                <YAxis 
                  tick={{ fill: 'currentColor', fontSize: 12 }}
                  axisLine={{ stroke: 'currentColor' }}
                  tickFormatter={(value) => `€${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="income" 
                  name="Income" 
                  fill="rgb(34, 197, 94)" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
                <Bar 
                  dataKey="expenses" 
                  name="Expenses" 
                  fill="rgb(239, 68, 68)" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
                <Bar 
                  dataKey="net" 
                  name="Net" 
                  fill="rgb(59, 130, 246)" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};