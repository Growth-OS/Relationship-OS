import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamMembersList } from "@/components/settings/team/TeamMembersList";
import { InviteMemberDialog } from "@/components/settings/team/InviteMemberDialog";
import { Loader2, UserPlus, Users2 } from "lucide-react";
import { toast } from "sonner";

const OrganisationSettings = () => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);

  const { data: teamData, isLoading, isError, refetch } = useQuery({
    queryKey: ["team"],
    queryFn: async () => {
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

      return teamMember;
    },
  });

  const handleCreateTeam = async () => {
    try {
      setIsCreatingTeam(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Start a transaction by creating the team first
      const { data: newTeam, error: teamError } = await supabase
        .from("teams")
        .insert([{ 
          name: `${user.email}'s Organisation`
        }])
        .select()
        .single();

      if (teamError) {
        console.error("Team creation error:", teamError);
        throw teamError;
      }

      // Then add the user as an owner
      const { error: memberError } = await supabase
        .from("team_members")
        .insert([{
          team_id: newTeam.id,
          user_id: user.id,
          role: 'owner',
          joined_at: new Date().toISOString()
        }]);

      if (memberError) {
        console.error("Member creation error:", memberError);
        throw memberError;
      }

      await refetch();
      toast.success("Organisation created successfully");
    } catch (error: any) {
      console.error("Error creating team:", error);
      toast.error(error.message || "Failed to create organisation");
    } finally {
      setIsCreatingTeam(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (isError) {
    toast.error("Failed to load organisation settings");
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-red-600">Error loading organisation settings. Please try again later.</p>
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
      
      {!teamData ? (
        <Card>
          <CardContent className="py-8 flex flex-col items-center justify-center space-y-4">
            <Users2 className="h-12 w-12 text-gray-400" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">No Organisation Found</h3>
              <p className="text-gray-600 mb-4">Create your organisation to start inviting team members</p>
              <Button 
                onClick={handleCreateTeam}
                disabled={isCreatingTeam}
              >
                {isCreatingTeam ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Organisation'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
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
      )}
    </div>
  );
};

export default OrganisationSettings;