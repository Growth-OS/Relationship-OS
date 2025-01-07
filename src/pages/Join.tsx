import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Join = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      toast.error("Invalid invitation link");
      navigate("/");
      return;
    }

    const fetchInvitation = async () => {
      try {
        const { data, error } = await supabase
          .from("team_invitations")
          .select("*, teams(name)")
          .eq("token", token)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Invitation not found");

        // Check if invitation has expired
        if (new Date(data.expires_at) < new Date()) {
          toast.error("This invitation has expired");
          navigate("/");
          return;
        }

        setInvitation(data);
      } catch (error) {
        console.error("Error fetching invitation:", error);
        toast.error("Failed to load invitation");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvitation();
  }, [searchParams, navigate]);

  const handleAcceptInvitation = async () => {
    if (!invitation) return;

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // If user is not logged in, redirect to login page
        navigate(`/login?redirect=${window.location.pathname}${window.location.search}`);
        return;
      }

      // Add user to team
      const { error: memberError } = await supabase
        .from("team_members")
        .insert({
          team_id: invitation.team_id,
          user_id: user.id,
          role: invitation.role,
          invited_by: invitation.invited_by,
          joined_at: new Date().toISOString()
        });

      if (memberError) throw memberError;

      // Update invitation status
      const { error: inviteError } = await supabase
        .from("team_invitations")
        .update({ status: "accepted" })
        .eq("id", invitation.id);

      if (inviteError) throw inviteError;

      toast.success("Successfully joined the team");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error("Failed to join team");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!invitation) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Team Invitation</CardTitle>
          <CardDescription>
            You've been invited to join {invitation.teams?.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-500">
            <p>Role: {invitation.role}</p>
            <p>Email: {invitation.email}</p>
          </div>
          <Button 
            className="w-full" 
            onClick={handleAcceptInvitation}
            disabled={isLoading}
          >
            {isLoading ? "Joining..." : "Accept Invitation"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Join;