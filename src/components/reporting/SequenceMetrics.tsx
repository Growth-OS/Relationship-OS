import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

export const SequenceMetrics = () => {
  const startDate = startOfMonth(new Date());
  const endDate = endOfMonth(new Date());

  const { data: sequenceData, isLoading: isLoadingSequences } = useQuery({
    queryKey: ['sequence-metrics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('sequence_assignments')
        .select(`
          created_at,
          status,
          prospect:prospects(company_name)
        `)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;
      return data;
    },
  });

  const { data: taskData, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['task-metrics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('completed', true)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (error) throw error;
      return data;
    },
  });

  // Prepare data for charts
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  const prospectData = days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const count = sequenceData?.filter(d => 
      format(new Date(d.created_at), 'yyyy-MM-dd') === dayStr
    ).length || 0;
    
    return {
      date: dayStr,
      prospects: count
    };
  });

  const tasksData = days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const count = taskData?.filter(d => 
      format(new Date(d.created_at), 'yyyy-MM-dd') === dayStr
    ).length || 0;
    
    return {
      date: dayStr,
      tasks: count
    };
  });

  if (isLoadingSequences || isLoadingTasks) {
    return <div>Loading metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Prospects Added to Sequences</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={prospectData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'dd MMM')}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => format(new Date(date), 'dd MMM yyyy')}
                />
                <Line 
                  type="monotone" 
                  dataKey="prospects" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {sequenceData?.length || 0}
            </p>
            <p className="text-sm text-gray-600">
              Total Prospects Added This Month
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Tasks Completed</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tasksData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'dd MMM')}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => format(new Date(date), 'dd MMM yyyy')}
                />
                <Line 
                  type="monotone" 
                  dataKey="tasks" 
                  stroke="#10B981" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {taskData?.length || 0}
            </p>
            <p className="text-sm text-gray-600">
              Total Tasks Completed This Month
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};