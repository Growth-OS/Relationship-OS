import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

interface MonthlyOverviewChartProps {
  data: MonthlyData[];
}

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

export const MonthlyOverviewChart = ({ data }: MonthlyOverviewChartProps) => {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:no-underline">Monthly Overview</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-gray-200 dark:stroke-gray-700" 
                vertical={false}
              />
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
                maxBarSize={40}
              />
              <Bar 
                dataKey="expenses" 
                name="Expenses" 
                fill="rgb(239, 68, 68)" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Bar 
                dataKey="net" 
                name="Net" 
                fill="rgb(59, 130, 246)" 
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};