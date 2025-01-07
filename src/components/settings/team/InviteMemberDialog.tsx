import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId?: string;
}

export const InviteMemberDialog = ({ open, onOpenChange, teamId }: InviteMemberDialogProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId) {
      toast.error("No team selected");
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Not authenticated");
        return;
      }

      // Get inviter's profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast.error("Error fetching user profile");
        return;
      }

      // Check if user already exists
      const { data: existingProfile, error: existingProfileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single();

      if (existingProfileError && existingProfileError.code !== 'PGRST116') {
        console.error("Error checking existing user:", existingProfileError);
        toast.error("Error checking existing user");
        return;
      }

      // Generate invitation token
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

      // Create invitation record
      const { error: inviteError } = await supabase
        .from("team_invitations")
        .insert({
          team_id: teamId,
          email,
          role,
          invited_by: user.id,
          token,
          status: 'pending',
          expires_at: expiresAt.toISOString()
        });

      if (inviteError) {
        console.error("Error creating invitation:", inviteError);
        toast.error("Failed to create invitation");
        return;
      }

      // Send invitation email
      const { error: emailError } = await supabase.functions.invoke('send-invitation', {
        body: {
          email,
          teamId,
          role,
          invitedBy: profile.full_name || user.email,
          token
        },
      });

      if (emailError) {
        console.error("Error sending invitation email:", emailError);
        toast.error("Failed to send invitation email");
        return;
      }

      toast.success("Team member invited successfully");
      onOpenChange(false);
      setEmail("");
      setRole("member");
    } catch (error) {
      console.error("Error inviting member:", error);
      toast.error("Failed to invite team member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Add a new member to your team
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleInvite} className="space-y-4">
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

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Inviting..." : "Send Invite"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};