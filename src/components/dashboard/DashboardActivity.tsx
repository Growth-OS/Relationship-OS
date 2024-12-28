import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ListTodo } from "lucide-react";

export const DashboardActivity = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Activity Overview</h2>
      <div className="space-y-4">
        <ActivityItem
          icon={Calendar}
          title="Upcoming Meetings"
          subtitle="2 meetings today"
          iconColor="purple"
        />
        <ActivityItem
          icon={ListTodo}
          title="Pending Tasks"
          subtitle="5 tasks due today"
          iconColor="blue"
        />
      </div>
    </Card>
  );
};

interface ActivityItemProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  iconColor: "purple" | "blue";
}

const ActivityItem = ({ icon: Icon, title, subtitle, iconColor }: ActivityItemProps) => {
  const colorClasses = {
    purple: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400",
    blue: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400",
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-full ${colorClasses[iconColor]} flex items-center justify-center`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm">View</Button>
    </div>
  );
};