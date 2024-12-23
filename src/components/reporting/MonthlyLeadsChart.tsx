import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Database } from "@/integrations/supabase/types";

type Prospect = {
  created_at: string;
  source?: Database['public']['Enums']['lead_source'] | null;
};

interface MonthlyLeadsChartProps {
  prospects: Prospect[];
}

export const MonthlyLeadsChart = ({ prospects }: MonthlyLeadsChartProps) => {
  const last12Months = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    return {
      start: startOfMonth(date),
      end: endOfMonth(date),
      label: format(date, 'MMM yyyy'),
    };
  }).reverse();

  const data = last12Months.map(month => {
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
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis />
        <Tooltip />
        <Bar dataKey="leads" fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  );
};