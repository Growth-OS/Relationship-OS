import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EuroIcon, Users, Percent, TrendingUp } from "lucide-react";

type StatCardProps = {
  totalPartners: number;
  monthlyEarnings: number;
  avgCommission: string;
  yearlyGrowth?: number;
};

export const StatsCards = ({ totalPartners, monthlyEarnings, avgCommission, yearlyGrowth = 0 }: StatCardProps) => {
  const stats = [
    {
      title: "Active Partners",
      value: totalPartners.toString(),
      trend: "Total partnerships",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Monthly Revenue",
      value: `€${monthlyEarnings.toFixed(2)}`,
      trend: "Current month earnings",
      icon: EuroIcon,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Avg. Commission",
      value: avgCommission,
      trend: "Across all partners",
      icon: Percent,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "YoY Growth",
      value: `${yearlyGrowth}%`,
      trend: "Year over year",
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-sm text-gray-600 mt-1">{stat.trend}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};