import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ModulePermissionsSelect } from "./ModulePermissionsSelect";

interface InviteMemberFormProps {
  teamId?: string;
}

export const InviteMemberForm = ({ teamId }: InviteMemberFormProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [selectedModules, setSelectedModules] = useState<string[]>(["dashboard"]);
  const [isLoading, setIsLoading] = useState(false);

  const handleModuleToggle = (moduleId: string) => {
    setSelectedModules(current =>
      current.includes(moduleId)
        ? current.filter(id => id !== moduleId)
        : [...current, moduleId]
    );
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId) {
      toast.error("No team found");
      return;
    }

    setIsLoading(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single();

      if (profileError) {
        toast.error("User not found");
        return;
      }

      // Insert team member
      const { data: teamMember, error: teamMemberError } = await supabase
        .from("team_members")
        .insert({
          team_id: teamId,
          user_id: profile.id,
          role,
          joined_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (teamMemberError) throw teamMemberError;

      // Insert module permissions
      const permissionsToInsert = selectedModules.map(module => ({
        team_member_id: teamMember.id,
        module: module as "dashboard" | "prospects" | "deals" | "sequences" | "tasks" | "calendar" | "affiliates" | "finances" | "invoices" | "reporting" | "development" | "substack" | "travels",
      }));

      const { error: permissionsError } = await supabase
        .from("team_member_permissions")
        .insert(permissionsToInsert);

      if (permissionsError) throw permissionsError;

      toast.success("Team member invited successfully");
      setEmail("");
      setRole("member");
      setSelectedModules(["dashboard"]);
    } catch (error) {
      console.error("Error inviting member:", error);
      toast.error("Failed to invite team member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleInvite} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Role</Label>
        <RadioGroup value={role} onValueChange={(value) => setRole(value as "admin" | "member")}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="member" id="member" />
            <Label htmlFor="member">Member</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="admin" id="admin" />
            <Label htmlFor="admin">Admin</Label>
          </div>
        </RadioGroup>
      </div>

      <ModulePermissionsSelect
        selectedModules={selectedModules}
        onModuleToggle={handleModuleToggle}
      />

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Inviting..." : "Send Invite"}
      </Button>
    </form>
  );
};