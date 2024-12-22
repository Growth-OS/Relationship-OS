import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

type Earning = {
  amount: number;
  date: string;
};

type MonthlyEarningsChartProps = {
  earnings: Earning[];
};

export const MonthlyEarningsChart = ({ earnings }: MonthlyEarningsChartProps) => {
  const monthlyData = useMemo(() => {
    const monthlyTotals = earnings.reduce((acc, earning) => {
      const monthKey = format(new Date(earning.date), 'MMM yyyy');
      acc[monthKey] = (acc[monthKey] || 0) + Number(earning.amount);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyTotals)
      .map(([month, total]) => ({
        month,
        total,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      });
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
        <LineChart data={monthlyData}>
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
          <Line 
            type="natural"
            dataKey="total" 
            stroke="var(--primary)"
            strokeWidth={2}
            dot={{ fill: 'var(--primary)', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};