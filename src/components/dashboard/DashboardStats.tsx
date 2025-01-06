import { Card } from "@/components/ui/card";
import { Target, Users, TrendingUp, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const DashboardStats = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        throw error;
      }
      return user;
    },
  });

  const { data: activeDeals = 0, isLoading: isLoadingDeals } = useQuery({
    queryKey: ["active-deals", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('user_id', user.id)
        .in('stage', ['lead', 'meeting', 'negotiation', 'project_preparation', 'in_progress']);
      
      if (error) {
        console.error('Error fetching deals:', error);
        throw error;
      }
      console.log('Active deals data:', data);
      console.log('Number of active deals:', data?.length || 0);
      return data?.length || 0;
    },
    enabled: !!user?.id,
  });

  const { data: activeProjects = 0, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["active-projects", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'active')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      return data?.length || 0;
    },
    enabled: !!user?.id,
  });

  const { data: completedTasks = 0, isLoading: isLoadingTasks } = useQuery({
    queryKey: ["completed-tasks", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('completed', true)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
      return data?.length || 0;
    },
    enabled: !!user?.id,
  });

  const { data: monthlyRevenue = 0, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ["monthly-revenue", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('financial_transactions')
        .select('amount')
        .eq('type', 'income')
        .eq('user_id', user.id)
        .gte('date', startOfMonth.toISOString());
      
      if (error) {
        console.error('Error fetching revenue:', error);
        throw error;
      }
      return data?.reduce((sum, transaction) => sum + Number(transaction.amount), 0) || 0;
    },
    enabled: !!user?.id,
  });

  const handleCardClick = (route: string) => {
    navigate(`/dashboard${route}`);
  };

  const stats = [
    {
      icon: Target,
      label: "Active Deals",
      value: isLoadingDeals ? "..." : activeDeals,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      darkIconBg: "bg-purple-900/50",
      darkIconColor: "text-purple-400",
      route: "/deals"
    },
    {
      icon: Users,
      label: "Active Projects",
      value: isLoadingProjects ? "..." : activeProjects,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      darkIconBg: "bg-blue-900/50",
      darkIconColor: "text-blue-400",
      route: "/projects"
    },
    {
      icon: TrendingUp,
      label: "Tasks Completed",
      value: isLoadingTasks ? "..." : completedTasks,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      darkIconBg: "bg-green-900/50",
      darkIconColor: "text-green-400",
      route: "/tasks"
    },
    {
      icon: DollarSign,
      label: "Monthly Revenue",
      value: isLoadingRevenue ? "..." : `$${monthlyRevenue?.toLocaleString() || '0'}`,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      darkIconBg: "bg-amber-900/50",
      darkIconColor: "text-amber-400",
      route: "/finances"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index}
            className="p-4 bg-white dark:bg-gray-800 border-purple-100 dark:border-gray-700 cursor-pointer transition-all hover:shadow-md"
            onClick={() => handleCardClick(stat.route)}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 ${stat.iconBg} dark:${stat.darkIconBg} rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.iconColor} dark:${stat.darkIconColor}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
