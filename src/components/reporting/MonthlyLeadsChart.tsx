import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface MonthlyLeadsChartProps {
  prospects: Array<{ created_at: string }>;
}

export const MonthlyLeadsChart = ({ prospects }: MonthlyLeadsChartProps) => {
  // Get the last 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      start: startOfMonth(date),
      end: endOfMonth(date),
      label: format(date, 'MMM yyyy'),
    };
  }).reverse();

  // Count prospects for each month
  const data = months.map(month => {
    const count = prospects.filter(prospect => {
      const createdAt = new Date(prospect.created_at);
      return createdAt >= month.start && createdAt <= month.end;
    }).length;

    return {
      month: month.label,
      leads: count,
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
          <Bar dataKey="leads" fill="#8884d8" name="New Leads" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};