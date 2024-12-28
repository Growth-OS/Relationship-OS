import { Card } from "@/components/ui/card";
import { Target, Users, TrendingUp, DollarSign } from "lucide-react";

export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={Target}
        label="Active Deals"
        value="12"
        gradient="from-purple-50 to-purple-100/30"
        iconColor="text-purple-600"
        darkGradient="from-gray-800 to-gray-900"
      />
      <StatCard
        icon={Users}
        label="Active Projects"
        value="8"
        gradient="from-blue-50 to-blue-100/30"
        iconColor="text-blue-600"
        darkGradient="from-gray-800 to-gray-900"
      />
      <StatCard
        icon={TrendingUp}
        label="Tasks Completed"
        value="24"
        gradient="from-green-50 to-green-100/30"
        iconColor="text-green-600"
        darkGradient="from-gray-800 to-gray-900"
      />
      <StatCard
        icon={DollarSign}
        label="Revenue"
        value="$24.5k"
        gradient="from-amber-50 to-amber-100/30"
        iconColor="text-amber-600"
        darkGradient="from-gray-800 to-gray-900"
      />
    </div>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  gradient: string;
  iconColor: string;
  darkGradient: string;
}

const StatCard = ({ icon: Icon, label, value, gradient, iconColor, darkGradient }: StatCardProps) => {
  return (
    <Card className={`p-4 bg-gradient-to-br ${gradient} dark:${darkGradient} border-purple-100 dark:border-gray-700`}>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
          <Icon className={`w-6 h-6 ${iconColor} dark:${iconColor.replace('600', '400')}`} />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-semibold text-purple-900 dark:text-purple-100">{value}</p>
        </div>
      </div>
    </Card>
  );
};