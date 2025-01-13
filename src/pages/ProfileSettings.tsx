import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ProfileSettings = () => {
  const navigate = useNavigate();
  
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const handleLogout = async () => {
    try {
      // First check if we have a valid session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no session exists, just clear local storage and redirect
        console.log("No active session found, performing local cleanup");
        localStorage.clear();
        navigate('/login');
        return;
      }

      // Attempt to sign out
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during sign out:", error);
        // If there's an error, force a clean logout
        localStorage.clear();
        navigate('/login');
        toast.error("Error signing out, please try again");
      }
    } catch (error) {
      console.error("Error during logout process:", error);
      // Ensure user is logged out even if there's an error
      localStorage.clear();
      navigate('/login');
      toast.error("Error signing out, please try again");
    }
  };

  return (
    <div className="max-w-[800px] space-y-6 text-left">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-left">Profile Settings</h1>
        <Button 
          variant="destructive" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Your account details and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input 
              value={user?.email || ''} 
              readOnly 
              className="bg-muted max-w-lg"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium">Full Name</label>
            <Input 
              value={user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''} 
              readOnly 
              className="bg-muted max-w-lg"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;