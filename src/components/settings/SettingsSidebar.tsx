import { NavLink, useNavigate } from "react-router-dom";
import { Wand2, User, Settings2, LogOut, Palette, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const SettingsSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast.error("There was an issue logging out. Please try again.");
        return;
      }

      // Clear local storage and redirect
      localStorage.clear();
      navigate("/login", { replace: true });
      toast.success("Successfully logged out");
      
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="w-64 h-full border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>
      <nav className="space-y-1">
        <NavLink
          to="/settings/profile"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <Settings2 className="w-5 h-5" />
          <span>Profile Settings</span>
        </NavLink>
        <NavLink
          to="/settings/team"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <Users className="w-5 h-5" />
          <span>Team</span>
        </NavLink>
        <NavLink
          to="/settings/branding"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
        >
          <Palette className="w-5 h-5" />
          <span>Branding</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-4"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};