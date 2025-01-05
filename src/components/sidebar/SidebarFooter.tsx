import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

export const SidebarFooter = () => {
  return (
    <div className="mt-auto pt-4">
      <Link
        to="/dashboard/settings/profile"
        className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white rounded-lg transition-colors"
      >
        <Settings className="w-5 h-5 mr-3" />
        <span>Settings</span>
      </Link>
    </div>
  );
};