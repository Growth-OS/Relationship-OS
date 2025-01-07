import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const ProfileSettings = () => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      if (error) {
        toast.error("Error fetching profile");
        throw error;
      }

      if (!profile) {
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ 
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || null
          }])
          .select()
          .single();

        if (createError) {
          toast.error("Error creating profile");
          throw createError;
        }

        return newProfile;
      }

      return profile;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] space-y-6">
      <h1 className="text-3xl font-bold">Profile Settings</h1>
      
      <Card>
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
              value={profile?.email || ''} 
              readOnly 
              className="bg-muted max-w-lg"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium">Full Name</label>
            <Input 
              value={profile?.full_name || ''} 
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