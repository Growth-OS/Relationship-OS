import { NavLink, useNavigate } from "react-router-dom";
import { Wand2, User, Settings2, LogOut, Palette, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const SettingsSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        navigate("/login", { replace: true });
        return;
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error);
        toast.error("There was an issue logging out. Please try again.");
        return;
      }

      toast.success("Successfully logged out");
      navigate("/login", { replace: true });
      
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An unexpected error occurred");
      navigate("/login", { replace: true });
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
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
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
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
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
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <Palette className="w-5 h-5" />
          <span>Branding</span>
        </NavLink>
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