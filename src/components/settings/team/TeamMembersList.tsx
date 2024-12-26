import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Shield, User } from "lucide-react";
import { toast } from "sonner";

interface TeamMembersListProps {
  teamId?: string;
}

type TeamMember = {
  id: string;
  role: 'owner' | 'admin' | 'member';
  user_id: string;
  profiles: {
    email: string;
    full_name: string | null;
  };
}

export const TeamMembersList = ({ teamId }: TeamMembersListProps) => {
  const { data: members, refetch } = useQuery({
    queryKey: ["team-members", teamId],
    queryFn: async () => {
      if (!teamId) return [];
      
      const { data, error } = await supabase
        .from("team_members")
        .select(`
          id,
          role,
          user_id,
          profiles:user_id (
            email,
            full_name
          )
        `)
        .eq("team_id", teamId);

      if (error) throw error;
      return data as unknown as TeamMember[];
    },
    enabled: !!teamId,
  });

  const handleRoleChange = async (memberId: string, newRole: 'admin' | 'member') => {
    try {
      const { error } = await supabase
        .from("team_members")
        .update({ role: newRole })
        .eq("id", memberId);

      if (error) throw error;
      
      toast.success(`Role updated successfully`);
      refetch();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;
      
      toast.success("Team member removed");
      refetch();
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove team member");
    }
  };

  return (
    <div className="space-y-4">
      {members?.map((member) => (
        <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                {member.profiles?.full_name?.[0] || member.profiles?.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {member.profiles?.full_name || member.profiles?.email}
              </p>
              <p className="text-sm text-gray-500">{member.profiles?.email}</p>
            </div>
            <Badge variant={member.role === 'owner' ? 'default' : 'secondary'} className="ml-2">
              {member.role === 'owner' ? (
                <Shield className="w-3 h-3 mr-1" />
              ) : member.role === 'admin' ? (
                <User className="w-3 h-3 mr-1" />
              ) : null}
              {member.role}
            </Badge>
          </div>

          {member.role !== 'owner' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => handleRoleChange(member.id, member.role === 'admin' ? 'member' : 'admin')}
                >
                  {member.role === 'admin' ? 'Remove admin' : 'Make admin'}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => handleRemoveMember(member.id)}
                >
                  Remove from team
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ))}
    </div>
  );
};