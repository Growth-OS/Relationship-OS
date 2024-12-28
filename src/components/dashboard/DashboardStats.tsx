import { Card } from "@/components/ui/card";
import { Target, Users, TrendingUp, DollarSign } from "lucide-react";

export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Target}
        label="Active Deals"
        value="12"
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
        darkIconBg="bg-purple-900/50"
        darkIconColor="text-purple-400"
      />
      <StatCard
        icon={Users}
        label="Active Projects"
        value="8"
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        darkIconBg="bg-blue-900/50"
        darkIconColor="text-blue-400"
      />
      <StatCard
        icon={TrendingUp}
        label="Tasks Completed"
        value="24"
        iconBg="bg-green-100"
        iconColor="text-green-600"
        darkIconBg="bg-green-900/50"
        darkIconColor="text-green-400"
      />
      <StatCard
        icon={DollarSign}
        label="Revenue"
        value="$24.5k"
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        darkIconBg="bg-amber-900/50"
        darkIconColor="text-amber-400"
      />
    </div>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  iconBg: string;
  iconColor: string;
  darkIconBg: string;
  darkIconColor: string;
}

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  iconBg,
  iconColor,
  darkIconBg,
  darkIconColor 
}: StatCardProps) => {
  return (
    <Card className="p-4 bg-white dark:bg-gray-800 border-purple-100 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <div className={`p-3 ${iconBg} dark:${darkIconBg} rounded-lg`}>
          <Icon className={`w-6 h-6 ${iconColor} dark:${darkIconColor}`} />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </Card>
  );
};