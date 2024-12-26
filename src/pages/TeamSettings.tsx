import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeamMembersList } from "@/components/settings/team/TeamMembersList";
import { InviteMemberDialog } from "@/components/settings/team/InviteMemberDialog";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const TeamSettings = () => {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const { data: teamData } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: teamMember, error } = await supabase
        .from("team_members")
        .select(`
          team_id,
          teams (
            id,
            name
          )
        `)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return teamMember;
    },
  });

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
          <TeamMembersList teamId={teamData?.teams?.id} />
        </CardContent>
      </Card>

      <InviteMemberDialog 
        open={inviteDialogOpen} 
        onOpenChange={setInviteDialogOpen}
        teamId={teamData?.teams?.id}
      />
    </div>
  );
};

export default TeamSettings;