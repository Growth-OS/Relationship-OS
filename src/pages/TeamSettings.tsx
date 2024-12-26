import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMembersList } from "@/components/settings/team/TeamMembersList";
import { InviteMemberDialog } from "@/components/settings/team/InviteMemberDialog";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

const TeamSettings = () => {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const { data: teamData, isLoading, error } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // First get the user's team memberships
      const { data: teamMemberships, error: membershipError } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", user.id)
        .limit(1);

      if (membershipError) {
        console.error("Error fetching team membership:", membershipError);
        throw membershipError;
      }

      if (!teamMemberships?.length) {
        return null;
      }

      // Then get the team details
      const { data: team, error: teamError } = await supabase
        .from("teams")
        .select("id, name")
        .eq("id", teamMemberships[0].team_id)
        .single();

      if (teamError) {
        console.error("Error fetching team:", teamError);
        throw teamError;
      }

      return team;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    toast.error("Failed to load team data");
    return <div>Error loading team data</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Settings</h1>
          <p className="text-gray-500">Manage your team members and their permissions</p>
        </div>
        <Button onClick={() => setInviteDialogOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            View and manage your team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TeamMembersList teamId={teamData?.id} />
        </CardContent>
      </Card>

      <InviteMemberDialog 
        open={inviteDialogOpen} 
        onOpenChange={setInviteDialogOpen}
        teamId={teamData?.id}
      />
    </div>
  );
};

export default TeamSettings;