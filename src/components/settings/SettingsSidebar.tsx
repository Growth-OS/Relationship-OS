import { NavLink } from "react-router-dom";
import { Wand2, User } from "lucide-react";

export const SettingsSidebar = () => {
  return (
    <div className="w-64 h-full border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>
      <nav className="space-y-1">
        <NavLink
          to="/settings/ai-persona"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <User className="w-5 h-5" />
          <span>AI Persona</span>
        </NavLink>
        <NavLink
          to="/settings/ai-prompts"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <Wand2 className="w-5 h-5" />
          <span>AI Prompts</span>
        </NavLink>
      </nav>
    </div>
  );
};