import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const activityData = [
  { date: 'Mon', tasks: 4, meetings: 2, deals: 1 },
  { date: 'Tue', tasks: 6, meetings: 3, deals: 2 },
  { date: 'Wed', tasks: 8, meetings: 4, deals: 3 },
  { date: 'Thu', tasks: 5, meetings: 2, deals: 2 },
  { date: 'Fri', tasks: 7, meetings: 5, deals: 4 },
];

export const DashboardActivityChart = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Weekly Activity</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={activityData}>
            <defs>
              <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#9b87f5" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMeetings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#33C3F0" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#33C3F0" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorDeals" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6E59A5" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6E59A5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis dataKey="date" className="text-gray-600 dark:text-gray-400" />
            <YAxis className="text-gray-600 dark:text-gray-400" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem'
              }}
            />
            <Area
              type="monotone"
              dataKey="tasks"
              stroke="#9b87f5"
              fillOpacity={1}
              fill="url(#colorTasks)"
            />
            <Area
              type="monotone"
              dataKey="meetings"
              stroke="#33C3F0"
              fillOpacity={1}
              fill="url(#colorMeetings)"
            />
            <Area
              type="monotone"
              dataKey="deals"
              stroke="#6E59A5"
              fillOpacity={1}
              fill="url(#colorDeals)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};