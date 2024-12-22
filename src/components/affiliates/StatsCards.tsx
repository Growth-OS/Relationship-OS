import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EuroIcon, Users, Percent } from "lucide-react";

type StatCardProps = {
  totalPartners: number;
  monthlyEarnings: number;
  avgCommission: string;
};

export const StatsCards = ({ totalPartners, monthlyEarnings, avgCommission }: StatCardProps) => {
  const stats = [
    {
      title: "Total Partners",
      value: totalPartners.toString(),
      trend: "Active partners",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Monthly Earnings",
      value: `€${monthlyEarnings.toFixed(2)}`,
      trend: "Current month",
      icon: EuroIcon,
      color: "text-purple-500",
    },
    {
      title: "Avg. Commission",
      value: avgCommission,
      trend: "Industry avg: 25%",
      icon: Percent,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
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