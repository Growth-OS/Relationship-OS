import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamMembersList } from "@/components/settings/team/TeamMembersList";
import { InviteMemberDialog } from "@/components/settings/team/InviteMemberDialog";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

const TeamSettings = () => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const { data: teamData, isLoading, isError } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      console.log("Fetching team data...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: teamMember, error: teamMemberError } = await supabase
        .from("team_members")
        .select("team_id, teams(id, name), role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (teamMemberError) {
        console.error("Error fetching team:", teamMemberError);
        throw teamMemberError;
      }

      console.log("Team data fetched:", teamMember);
      return teamMember;
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
    toast.error("Failed to load team settings");
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-red-600">Error loading team settings. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-left mb-2">Team Settings</h1>
        <p className="text-gray-600 text-left">Manage your team members and permissions</p>
      </div>
      
      <div className="grid gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage your team members and their roles
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

export default TeamSettings;