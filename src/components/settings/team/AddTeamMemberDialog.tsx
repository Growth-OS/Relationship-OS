import { useState } from "react";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

type Role = "owner" | "admin" | "member";

export const AddTeamMemberDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);

  const generateCredentials = () => {
    const email = `${fullName.toLowerCase().replace(/\s+/g, ".")}.${Date.now()}@temp.com`;
    const password = Math.random().toString(36).slice(-12);
    return { email, password };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: teamData } = await supabase
        .from("team_members")
        .select("team_id")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!teamData?.team_id) {
        throw new Error("No team found");
      }

      const generatedCredentials = generateCredentials();

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: generatedCredentials.email,
        password: generatedCredentials.password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError || !authData.user) throw authError;

      const { error: teamError } = await supabase.from("team_members").insert({
        team_id: teamData.team_id,
        user_id: authData.user.id,
        role: role,
        temp_password: generatedCredentials.password,
        invited_by: (await supabase.auth.getUser()).data.user?.id,
      });

      if (teamError) throw teamError;

      setCredentials(generatedCredentials);
      toast.success("Team member added successfully");
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Failed to add team member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFullName("");
    setRole("member");
    setCredentials(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Team Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Team Member</DialogTitle>
        </DialogHeader>

        {credentials ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="font-medium mb-2">Login Credentials</h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {credentials.email}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Password:</span> {credentials.password}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Please save these credentials and share them securely with the team member.
              They can change their password after logging in.
            </p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value: Role) => setRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Team Member"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};