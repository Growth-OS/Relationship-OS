import { Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

export const SidebarFooter = () => {
  return (
    <div className="mt-auto pt-4">
      <NavLink
        to="/dashboard/settings/profile"
        className={({ isActive }) =>
          `flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white rounded-lg transition-colors ${
            isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white" : ""
          }`
        }
      >
        <Settings className="w-5 h-5 mr-3" />
        <span>Settings</span>
      </NavLink>
    </div>
  );
};