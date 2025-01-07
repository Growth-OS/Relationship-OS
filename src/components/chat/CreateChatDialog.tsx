import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquarePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { nanoid } from "@/lib/utils";

export const CreateChatDialog = () => {
  const [title, setTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create a new chat room
      const { data: room, error: roomError } = await supabase
        .from("chat_rooms")
        .insert({
          title,
          created_by: user.id,
          access_code: nanoid(12),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Add the creator as a participant
      const { error: participantError } = await supabase
        .from("chat_participants")
        .insert({
          room_id: room.id,
          user_id: user.id,
          display_name: user.email,
          is_external: false,
        });

      if (participantError) throw participantError;

      toast.success("Chat room created successfully");
      setIsOpen(false);
      setTitle("");
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create chat room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          New Chat Room
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Chat Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateChat} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Chat Room Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for the chat room"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Chat Room"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};