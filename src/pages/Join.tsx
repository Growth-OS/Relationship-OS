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
  const token = searchParams.get("token");

  useEffect(() => {
    const checkInvitation = async () => {
      if (!token) {
        toast.error("Invalid invitation link");
        navigate("/");
        return;
      }

      try {
        const { data: invite, error } = await supabase
          .from("team_invitations")
          .select("*, teams(name)")
          .eq("token", token)
          .single();

        if (error || !invite) {
          throw new Error("Invitation not found");
        }

        if (new Date(invite.expires_at) < new Date()) {
          throw new Error("Invitation has expired");
        }

        setInvitation(invite);
      } catch (error) {
        toast.error(error.message);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkInvitation();
  }, [token, navigate]);

  const handleAcceptInvitation = async () => {
    if (!invitation) return;

    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Save the token and redirect to signup
        localStorage.setItem("invitation_token", token);
        navigate("/login");
        return;
      }

      // Add user to team
      const { error: memberError } = await supabase
        .from("team_members")
        .insert({
          team_id: invitation.team_id,
          user_id: user.id,
          role: invitation.role,
        });

      if (memberError) throw memberError;

      // Delete the invitation
      await supabase
        .from("team_invitations")
        .delete()
        .eq("token", token);

      toast.success("You've successfully joined the team!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to join team");
      console.error("Join error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Team Invitation</CardTitle>
          <CardDescription>
            You've been invited to join {invitation?.teams?.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-sm text-gray-600">
            Click the button below to accept the invitation and join the team.
          </p>
          <Button
            className="w-full"
            onClick={handleAcceptInvitation}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Accept Invitation"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Join;