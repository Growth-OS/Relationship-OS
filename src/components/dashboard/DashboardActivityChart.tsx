import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfYear, format, eachMonthOfInterval } from "date-fns";

export const DashboardActivityChart = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['monthly-profit-loss'],
    queryFn: async () => {
      try {
        const startDate = startOfYear(new Date());
        console.log('Fetching transactions from:', startDate.toISOString());
        
        const { data, error } = await supabase
          .from('financial_transactions')
          .select('*')
          .gte('date', startDate.toISOString())
          .order('date');
        
        if (error) {
          console.error('Error fetching transactions:', error);
          throw error;
        }
        
        console.log('Fetched transactions:', data);
        return data;
      } catch (error) {
        console.error('Error in transaction query:', error);
        throw error;
      }
    },
  });

  const monthlyData = eachMonthOfInterval({
    start: startOfYear(new Date()),
    end: new Date()
  }).map(date => {
    const monthTransactions = transactions?.filter(t => 
      format(new Date(t.date), 'MMM yyyy') === format(date, 'MMM yyyy')
    ) || [];

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      month: format(date, 'MMM'),
      profit: income - expenses
    };
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Profit/Loss</h3>
        <div className="h-[300px] w-full flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Monthly Profit/Loss</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis 
              dataKey="month" 
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis 
              className="text-gray-600 dark:text-gray-400"
              tickFormatter={(value) => `€${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem'
              }}
              formatter={(value: number) => [`€${value.toFixed(2)}`, 'Profit/Loss']}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#10B981"
              fill="url(#colorProfit)"
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};