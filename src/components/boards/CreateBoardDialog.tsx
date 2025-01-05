import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CreateBoardDialogProps {
  onBoardCreated: () => void;
}

export const CreateBoardDialog = ({ onBoardCreated }: CreateBoardDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast.error("You must be logged in to create a board");
        return;
      }

      const { error } = await supabase
        .from('boards')
        .insert({
          name,
          description,
          user_id: user.user.id,
          last_edited_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success("Board created successfully");
      setOpen(false);
      setName("");
      setDescription("");
      onBoardCreated();
    } catch (error) {
      console.error('Error creating board:', error);
      toast.error("Failed to create board");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Board
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateBoard} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Board Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter board name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter board description (optional)"
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full">Create Board</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};