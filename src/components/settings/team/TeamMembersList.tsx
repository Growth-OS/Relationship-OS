import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TeamMember {
  id: string;
  role: string;
  user_id: string;
  profiles: {
    full_name: string | null;
    email: string;
  } | null;
}

export const TeamMembersList = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data: teamData } = await supabase
          .from("team_members")
          .select("team_id")
          .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (teamData?.team_id) {
          const { data: members } = await supabase
            .from("team_members")
            .select(`
              id,
              role,
              user_id,
              profiles:profiles(full_name, email)
            `)
            .eq("team_id", teamData.team_id);

          if (members) {
            setMembers(members);
          }
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

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
                <p className="font-medium">{member.profiles?.full_name || "Pending Setup"}</p>
                <p className="text-sm text-gray-500">{member.profiles?.email}</p>
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