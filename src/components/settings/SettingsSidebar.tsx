import { NavLink, useNavigate } from "react-router-dom";
import { Wand2, User, Settings2, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const SettingsSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // First clear any existing session
      await supabase.auth.signOut({ scope: 'local' });
      
      // Then attempt a global signout
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error("Logout error:", error);
        // Even if there's an error, we'll redirect to login since the local session is cleared
        toast.error("There was an issue with the logout, but you've been signed out locally");
      } else {
        toast.success("Successfully logged out");
      }
      
      // Always navigate to login after clearing the session
      navigate("/login", { replace: true });
      
    } catch (error) {
      console.error("Logout error:", error);
      // Even in case of an error, redirect to login for safety
      toast.error("An unexpected error occurred, but you've been signed out");
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