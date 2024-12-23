import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface MonthlyConversionsChartProps {
  prospects: Array<{ created_at: string; status: string }>;
}

export const MonthlyConversionsChart = ({ prospects }: MonthlyConversionsChartProps) => {
  // Get the last 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      start: startOfMonth(date),
      end: endOfMonth(date),
      label: format(date, 'MMM yyyy'),
    };
  }).reverse();

  // Count converted prospects for each month
  const data = months.map(month => {
    const count = prospects.filter(prospect => {
      const createdAt = new Date(prospect.created_at);
      return (
        createdAt >= month.start && 
        createdAt <= month.end && 
        prospect.status === 'converted'
      );
    }).length;

    return {
      month: month.label,
      conversions: count,
    };
  });

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar 
            dataKey="conversions" 
            fill="var(--primary)" 
            name="Converted Prospects"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};