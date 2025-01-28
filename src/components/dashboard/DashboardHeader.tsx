import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DashboardHeaderProps {
  firstName: string;
}

export const DashboardHeader = ({ firstName }: DashboardHeaderProps) => {
  const [greeting, setGreeting] = useState("");

  const { data: highlights } = useQuery({
    queryKey: ['dashboard-highlights'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get tasks due today
      const today = format(new Date(), 'yyyy-MM-dd');
      const { count: tasksDueToday } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('completed', false)
        .eq('due_date', today);

      // Get active deals
      const { count: activeDeals } = await supabase
        .from('deals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .neq('stage', 'lost');

      return {
        tasksDueToday: tasksDueToday || 0,
        activeDeals: activeDeals || 0,
      };
    },
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

  return (
    <div className="relative overflow-hidden rounded-lg bg-[#161e2c] border border-gray-800/40 shadow-sm">
      <div className="relative z-10 px-6 py-8">
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl font-medium text-white">
              {greeting}, {firstName}!
            </h1>
            <p className="text-sm text-gray-300 mt-1">
              Here's what's happening today, {format(new Date(), 'do MMMM yyyy')}
            </p>
          </div>

          <div className="flex justify-center">
            <div className="space-y-4 max-w-lg w-full">
              <h2 className="text-lg font-semibold text-white text-center">Today's Highlights</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-white">{highlights?.tasksDueToday}</div>
                  <div className="text-sm text-gray-300">Tasks Due Today</div>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="text-2xl font-bold text-white">{highlights?.activeDeals}</div>
                  <div className="text-sm text-gray-300">Active Deals</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};