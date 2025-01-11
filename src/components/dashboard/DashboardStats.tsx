import { useTaskStats } from "./hooks/useTaskStats";
import { useDealStats } from "./hooks/useDealStats";

export const DashboardStats = () => {
  const { completedTasks, lastMonthTasks, isLoadingTasks } = useTaskStats();
  const { totalDeals, lastMonthDeals, isLoadingDeals } = useDealStats();
  const currentQuarter = Math.floor(new Date().getMonth() / 3) + 1;

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return "New"; // Handle case where last quarter was 0
    const change = ((current - previous) / previous) * 100;
    return `${Math.abs(change).toFixed(1)}%`;
  };

  const determineChangeType = (current: number, previous: number) => {
    if (previous === 0) return 'neutral';
    return current >= previous ? 'increase' : 'decrease';
  };

  const stats = [
    {
      name: `Q${currentQuarter} Deals`,
      value: isLoadingDeals ? "..." : totalDeals?.toString() || '0',
      change: calculatePercentageChange(totalDeals || 0, lastMonthDeals || 0),
      changeType: determineChangeType(totalDeals || 0, lastMonthDeals || 0),
    },
    {
      name: `Q${currentQuarter} Tasks`,
      value: isLoadingTasks ? "..." : completedTasks?.toString() || '0',
      change: calculatePercentageChange(completedTasks || 0, lastMonthTasks || 0),
      changeType: determineChangeType(completedTasks || 0, lastMonthTasks || 0),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">{stat.name}</h3>
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className={`text-sm ${
            stat.changeType === 'increase' 
              ? 'text-green-500' 
              : stat.changeType === 'decrease' 
                ? 'text-red-500' 
                : 'text-gray-500'
          }`}>
            {stat.changeType === 'increase' 
              ? '↑' 
              : stat.changeType === 'decrease' 
                ? '↓' 
                : '•'} {stat.change} vs last quarter
          </p>
        </div>
      ))}
    </div>
  );
};