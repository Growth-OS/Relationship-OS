import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

const ProfileSettings = () => {
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    },
  });

  const { data: profiles, refetch } = useQuery({
    queryKey: ["linkedin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("linkedin_profiles")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleAddProfile = async () => {
    try {
      // In a real app, you would fetch profile data from LinkedIn API
      // For now, we'll just save the URL and some mock data
      const mockData = {
        profile_url: linkedinUrl,
        name: "John Doe",
        job_title: "Software Engineer",
        profile_image_url: "/placeholder.svg",
      };

      const { error } = await supabase
        .from("linkedin_profiles")
        .insert([{ ...mockData, user_id: (await supabase.auth.getUser()).data.user?.id }]);

      if (error) throw error;

      toast.success("Profile added successfully");
      setLinkedinUrl("");
      refetch();
    } catch (error) {
      console.error("Error adding profile:", error);
      toast.error("Failed to add profile");
    }
  };

  return (
    <div className="space-y-6">
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
              value={user?.email || ''} 
              readOnly 
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium">Full Name</label>
            <Input 
              value={user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''} 
              readOnly 
              className="bg-muted"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Writing Style</CardTitle>
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Beta
            </Badge>
          </div>
          <CardDescription>
            Add LinkedIn profiles to inspire your writing style
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Enter LinkedIn profile URL"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddProfile}>Add Profile</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profiles?.map((profile) => (
                <HoverCard key={profile.id}>
                  <HoverCardTrigger asChild>
                    <div className="p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={profile.profile_image_url} alt={profile.name} />
                          <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{profile.name}</h3>
                          <p className="text-sm text-muted-foreground">{profile.job_title}</p>
                        </div>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{profile.name}</h4>
                      <p className="text-sm">{profile.job_title}</p>
                      <a
                        href={profile.profile_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Profile
                      </a>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;