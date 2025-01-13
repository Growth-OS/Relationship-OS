import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  previousValue: number;
  trend: Array<{ value: number }>;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  previousValue,
  trend,
  icon: Icon,
  color,
  bgColor,
}: StatCardProps) => {
  const percentChange = previousValue === 0 ? 0 : ((Number(value) - previousValue) / previousValue) * 100;
  const TrendIcon = percentChange > 0 ? TrendingUp : percentChange < 0 ? TrendingDown : Minus;
  const trendColor = percentChange > 0 ? 'text-green-500' : percentChange < 0 ? 'text-red-500' : 'text-gray-500';

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${bgColor}`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <TrendIcon className={`w-4 h-4 ${trendColor}`} />
              <span className={`text-sm ${trendColor}`}>
                {Math.abs(percentChange).toFixed(1)}%
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Compared to last quarter</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      <div className="space-y-2">
        <p className="text-2xl font-bold">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          vs {previousValue.toLocaleString()} last quarter
        </div>
      </div>

      <div className="h-16 mt-4 opacity-50 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trend}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color.replace('text-', '#')} 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};