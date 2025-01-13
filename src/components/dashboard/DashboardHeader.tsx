import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Calendar, Briefcase, ListTodo, Receipt, Wallet } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DashboardHeaderProps {
  firstName: string;
}

export const DashboardHeader = ({ firstName }: DashboardHeaderProps) => {
  const [greeting, setGreeting] = useState("");
  const navigate = useNavigate();

  const { data: highlights, error: highlightsError } = useQuery({
    queryKey: ['dashboard-highlights'],
    queryFn: async () => {
      console.log('Fetching dashboard highlights...');
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      
      if (!user) {
        console.error('No authenticated user found');
        throw new Error("Not authenticated");
      }

      console.log('Authenticated user:', user.id);

      // Get tasks due today
      const today = format(new Date(), 'yyyy-MM-dd');
      const { count: tasksDueToday, error: tasksError } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('completed', false)
        .eq('due_date', today);

      if (tasksError) {
        console.error('Tasks fetch error:', tasksError);
        throw tasksError;
      }

      // Get active deals
      const { count: activeDeals, error: dealsError } = await supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .neq('stage', 'lost');

      if (dealsError) {
        console.error('Deals fetch error:', dealsError);
        throw dealsError;
      }

      console.log('Fetched data:', { tasksDueToday, activeDeals });

      return {
        tasksDueToday: tasksDueToday || 0,
        activeDeals: activeDeals || 0,
      };
    },
    retry: 1,
    meta: {
      onError: (error: Error) => {
        console.error('Query error:', error);
        toast.error("Failed to load dashboard data. Please check your connection and try again.");
      }
    }
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good evening");
    } else {
      setGreeting("Working late");
    }
  }, []);

  if (highlightsError) {
    console.error('Highlights error:', highlightsError);
  }

  const quickActions = [
    {
      label: "New Task",
      icon: ListTodo,
      onClick: () => navigate("/dashboard/tasks/new"),
      color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    },
    {
      label: "New Deal",
      icon: Briefcase,
      onClick: () => navigate("/dashboard/deals/new"),
      color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    },
    {
      label: "New Invoice",
      icon: Receipt,
      onClick: () => navigate("/dashboard/invoices/new"),
      color: "bg-amber-100 text-amber-700 hover:bg-amber-200",
    },
    {
      label: "Add Transaction",
      icon: Wallet,
      onClick: () => navigate("/dashboard/finances/new"),
      color: "bg-rose-100 text-rose-700 hover:bg-rose-200",
    },
    {
      label: "Schedule",
      icon: Calendar,
      onClick: () => navigate("/dashboard/calendar"),
      color: "bg-green-100 text-green-700 hover:bg-green-200",
    },
  ];

  return (
    <Card className="p-6 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-none shadow-sm">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {greeting}, {firstName}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening today, {format(new Date(), 'do MMMM yyyy')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Today's Highlights</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                <div className="text-2xl font-bold">{highlights?.tasksDueToday}</div>
                <div className="text-sm text-muted-foreground">Tasks Due Today</div>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                <div className="text-2xl font-bold">{highlights?.activeDeals}</div>
                <div className="text-sm text-muted-foreground">Active Deals</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="ghost"
                  className={`${action.color} gap-2`}
                  onClick={action.onClick}
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};