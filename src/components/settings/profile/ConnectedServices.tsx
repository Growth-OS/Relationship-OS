import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const ConnectedServices = () => {
  const { data: googleConnection, isError } = useQuery({
    queryKey: ["google-connection"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("oauth_connections")
        .select("*")
        .eq("provider", "google")
        .maybeSingle(); // Changed from .single() to .maybeSingle()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching Google connection:", error);
        throw error;
      }
      return data;
    },
  });

  const handleConnectGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/calendar.readonly',
          redirectTo: `${window.location.origin}/settings/profile`,
        },
      });

      if (error) {
        console.error("Google OAuth error:", error);
        toast.error("Failed to connect Google Calendar");
        throw error;
      }
    } catch (error) {
      console.error("Error connecting Google Calendar:", error);
      toast.error("Failed to connect Google Calendar");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Services</CardTitle>
        <CardDescription>
          Manage your connected services and integrations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-4">
            <Calendar className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-medium">Google Calendar</h3>
              <p className="text-sm text-muted-foreground">
                {googleConnection ? 'Connected' : 'Not connected'}
              </p>
            </div>
          </div>
          <Button
            variant={googleConnection ? "outline" : "default"}
            onClick={handleConnectGoogle}
          >
            {googleConnection ? 'Reconnect' : 'Connect'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};