import React from "react";
import { useNavigate } from "react-router-dom";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const SidebarFooter = () => {
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error);
        toast.error("Failed to sign out. Please try again.");
        return;
      }

      // Clear local storage and redirect
      localStorage.clear();
      navigate("/login", { replace: true });
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <>
      <button
        onClick={() => navigate('/settings')}
        className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <Settings2 className="w-5 h-5" />
        <span>Settings</span>
      </button>
      <Button
        variant="outline"
        className="w-full"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </>
  );
};