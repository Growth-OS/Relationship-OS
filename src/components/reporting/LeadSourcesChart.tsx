import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Database } from "@/integrations/supabase/types";

type Prospect = {
  source?: Database['public']['Enums']['lead_source'] | null;
};

interface LeadSourcesChartProps {
  prospects: Prospect[];
}

export const LeadSourcesChart = ({ prospects }: LeadSourcesChartProps) => {
  const sourceColors = {
    website: "#4CAF50",
    referral: "#2196F3",
    linkedin: "#9C27B0",
    cold_outreach: "#FF9800",
    conference: "#F44336",
    other: "#607D8B",
  };

  const sourceCounts = prospects.reduce((acc, prospect) => {
    const source = prospect.source || 'other';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(sourceCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1).replace('_', ' '),
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={sourceColors[entry.name.toLowerCase().replace(' ', '_') as keyof typeof sourceColors]} 
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};