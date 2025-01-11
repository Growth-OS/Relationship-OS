import { DashboardQuote } from "@/components/dashboard/DashboardQuote";

interface DashboardHeaderProps {
  firstName: string;
}

export const DashboardHeader = ({ firstName }: DashboardHeaderProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Welcome back, {firstName}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg">
          Here's what's happening with your business today.
        </p>
      </div>
      <div className="hover:shadow-md transition-shadow">
        <DashboardQuote />
      </div>
    </div>
  );
};