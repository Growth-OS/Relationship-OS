import { Bot } from "lucide-react";

interface DashboardHeaderProps {
  firstName: string;
}

export const DashboardHeader = ({ firstName }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        Welcome back, {firstName}!
      </h1>
      <p className="text-base text-gray-600 dark:text-gray-400">
        Here's what's happening in your workspace today
      </p>
    </div>
  );
};