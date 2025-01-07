import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "./types";
import { useToast } from "@/hooks/use-toast";

export const TeamMembersList = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // First get the user's team
        const { data: teamData } = await supabase
          .from("team_members")
          .select("team_id")
          .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
          .maybeSingle();

        if (teamData?.team_id) {
          // Then get all members of that team with their user data
          const { data: membersData, error } = await supabase
            .from("team_members")
            .select(`
              id,
              role,
              user_id,
              profiles:user_id (
                full_name,
                email
              )
            `)
            .eq("team_id", teamData.team_id);

          if (error) throw error;

          if (membersData) {
            // Transform the data to match our TeamMember type
            const transformedMembers: TeamMember[] = membersData.map(member => ({
              id: member.id,
              role: member.role,
              user_id: member.user_id,
              user: {
                full_name: member.profiles?.full_name || null,
                email: member.profiles?.email || ''
              }
            }));
            setMembers(transformedMembers);
          }
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
        toast({
          title: "Error",
          description: "Failed to fetch team members",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, [toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Team Members</h2>
      </div>
      <div className="divide-y">
        {members.map((member) => (
          <div key={member.id} className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{member.user?.full_name || "Pending Setup"}</p>
                <p className="text-sm text-gray-500">{member.user?.email}</p>
              </div>
              <span className="text-sm capitalize bg-gray-100 px-2 py-1 rounded">
                {member.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};