import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const JoinChatRoom = () => {
  const { accessCode } = useParams();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Find the chat room with the access code
      const { data: room, error: roomError } = await supabase
        .from("chat_rooms")
        .select("*")
        .eq("access_code", accessCode)
        .single();

      if (roomError) throw new Error("Invalid access code");

      // Add the user as a participant
      const { data: participant, error: participantError } = await supabase
        .from("chat_participants")
        .insert({
          room_id: room.id,
          display_name: displayName,
          email: email,
          is_external: true,
        })
        .select()
        .single();

      if (participantError) throw participantError;

      toast.success("Successfully joined the chat room!");
      navigate(`/dashboard/chat/${room.id}`);
    } catch (error) {
      console.error("Error joining chat:", error);
      toast.error("Failed to join chat room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md space-y-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Join Chat Room</h1>
          <p className="text-muted-foreground">
            Enter your details to join the conversation
          </p>
        </div>

        <form onSubmit={handleJoinChat} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              placeholder="Enter your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Joining..." : "Join Chat Room"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default JoinChatRoom;