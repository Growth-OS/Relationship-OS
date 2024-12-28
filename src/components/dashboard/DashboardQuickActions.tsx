import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ListTodo, Clock, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const DashboardQuickActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const actions = [
    { 
      icon: Calendar, 
      label: "Schedule Meeting", 
      action: () => navigate('/calendar')
    },
    { 
      icon: ListTodo, 
      label: "Create Task", 
      action: () => navigate('/tasks')
    },
    { 
      icon: Clock, 
      label: "Time Tracking", 
      action: () => {
        toast({
          title: "Coming Soon",
          description: "Time tracking feature will be available soon!",
        });
      }
    },
    { 
      icon: FileText, 
      label: "New Document", 
      action: () => navigate('/projects')
    },
  ];

  return (
    <Card className="p-6 bg-white dark:bg-gray-800 border border-purple-100 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant="outline"
              className="flex items-center justify-start gap-3 h-16 px-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={action.action}
            >
              <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};