import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

type Earning = {
  amount: number;
  date: string;
};

type MonthlyEarningsChartProps = {
  earnings: Earning[];
};

export const MonthlyEarningsChart = ({ earnings }: MonthlyEarningsChartProps) => {
  const monthlyData = useMemo(() => {
    // Get the current date and 11 months ago
    const today = new Date();
    const elevenMonthsAgo = subMonths(today, 11);
    
    // Create an array of the last 12 months
    const last12Months = Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(today, 11 - i);
      return format(date, 'MMM yyyy');
    });

    // Calculate monthly totals from earnings data
    const monthlyTotals = earnings.reduce((acc, earning) => {
      const monthKey = format(new Date(earning.date), 'MMM yyyy');
      // Only include earnings from the last 12 months
      if (new Date(earning.date) >= startOfMonth(elevenMonthsAgo) && 
          new Date(earning.date) <= endOfMonth(today)) {
        acc[monthKey] = (acc[monthKey] || 0) + Number(earning.amount);
      }
      return acc;
    }, {} as Record<string, number>);

    // Create data points for all months in the last 12 months
    return last12Months.map(month => ({
      month,
      total: monthlyTotals[month] || 0,
    }));
  }, [earnings]);

  if (!monthlyData.length) {
    return (
      <div className="text-center py-4 text-sm text-gray-500">
        No earnings data available to display
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData}>
          <XAxis 
            dataKey="month"
            tick={{ fill: '#666', fontSize: 12 }}
          />
          <YAxis 
            tick={{ fill: '#666', fontSize: 12 }}
            tickFormatter={(value) => `€${value}`}
          />
          <Tooltip 
            formatter={(value: number) => [`€${value.toFixed(2)}`, 'Earnings']}
            labelStyle={{ color: '#666' }}
          />
          <Bar 
            dataKey="total" 
            fill="var(--primary)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};