import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8",
  "#82CA9D", "#FFC658", "#FF6B6B", "#4ECDC4", "#45B7D1"
];

export const ExpensesByCategoryChart = () => {
  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses-by-category'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('amount, category')
        .eq('type', 'expense')
        .order('amount', { ascending: false });

      if (error) throw error;

      // Group expenses by category
      const categoryTotals = data.reduce((acc: { [key: string]: number }, transaction) => {
        const category = transaction.category || 'Uncategorized';
        acc[category] = (acc[category] || 0) + Number(transaction.amount);
        return acc;
      }, {});

      // Convert to array format for the pie chart
      return Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2))
      }));
    },
  });

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenses}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({ name, value }) => `€${value}`}
              >
                {expenses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `€${value.toFixed(2)}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};