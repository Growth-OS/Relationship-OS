import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamMembersList } from "@/components/settings/team/TeamMembersList";
import { InviteMemberDialog } from "@/components/settings/team/InviteMemberDialog";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

const OrganisationSettings = () => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const { data: teamData, isLoading, isError } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        console.log("Fetching team data for user:", user.id);

        const { data: teamMember, error: teamMemberError } = await supabase
          .from("team_members")
          .select("team_id, teams(id, name), role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (teamMemberError) {
          console.error("Error fetching team:", teamMemberError);
          throw teamMemberError;
        }

        if (!teamMember) {
          throw new Error("No team found for user");
        }

        console.log("Team data fetched:", teamMember);
        return teamMember;
      } catch (error) {
        console.error("Error in team query:", error);
        throw error;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (isError || !teamData?.team_id) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <p className="text-red-600">Unable to load your organisation settings. You might not be part of any organisation yet.</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-left mb-2">Organisation Settings</h1>
        <p className="text-gray-600 text-left">Manage your organisation members and permissions</p>
      </div>
      
      <div className="grid gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Organisation Members</CardTitle>
              <CardDescription>
                Manage your organisation members and their roles
              </CardDescription>
            </div>
            <Button 
              onClick={() => setIsInviteDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </CardHeader>
          <CardContent>
            <TeamMembersList teamId={teamData.team_id} />
          </CardContent>
        </Card>

        <InviteMemberDialog
          open={isInviteDialogOpen}
          onOpenChange={setIsInviteDialogOpen}
          teamId={teamData.team_id}
        />
      </div>
    </div>
  );
};

export default OrganisationSettings;