import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { lostReasons } from "../crm/form-fields/LostReasonSelect";
import { subMonths } from "date-fns";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export const LostDealsReport = () => {
  const { data: lostDeals = [] } = useQuery({
    queryKey: ['deals', 'lost'],
    queryFn: async () => {
      const twelveMonthsAgo = subMonths(new Date(), 12).toISOString();
      
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('stage', 'lost')
        .gte('created_at', twelveMonthsAgo);
      
      if (error) throw error;
      return data;
    },
  });

  const reasonsData = lostReasons.map(reason => ({
    name: reason.label,
    value: lostDeals.filter(deal => deal.lost_reason === reason.id).length,
    totalValue: lostDeals
      .filter(deal => deal.lost_reason === reason.id)
      .reduce((sum, deal) => sum + Number(deal.deal_value), 0)
  })).filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Lost Deals by Reason (Last 12 Months)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reasonsData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => 
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {reasonsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium">Value of Lost Deals by Reason</h4>
            {reasonsData.map((item, index) => (
              <div key={item.name} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">
                  €{item.totalValue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};