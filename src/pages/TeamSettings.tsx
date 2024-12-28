import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InviteMemberDialog } from "@/components/settings/team/InviteMemberDialog";
import { TeamMembersList } from "@/components/settings/team/TeamMembersList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TeamSettings = () => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const { data: team } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

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
            <Button onClick={() => setIsInviteDialogOpen(true)}>
              Invite Member
            </Button>
          </CardHeader>
          <CardContent>
            <TeamMembersList teamId={team?.id} />
          </CardContent>
        </Card>

        <InviteMemberDialog
          open={isInviteDialogOpen}
          onOpenChange={setIsInviteDialogOpen}
          teamId={team?.id}
        />
      </div>
    </div>
  );
};

export default TeamSettings;