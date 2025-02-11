import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RichTextEditor } from "@/components/content/RichTextEditor";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface NoteEditorProps {
  projectId: string;
  onNoteAdded: () => void;
}

export const NoteEditor = ({ projectId, onNoteAdded }: NoteEditorProps) => {
  const [newNote, setNewNote] = useState("");

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error("Please enter a note");
      return;
    }

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (!userData.user) {
        throw new Error("No authenticated user found");
      }

      const { error: insertError } = await supabase
        .from("project_chat_history")
        .insert({
          project_id: projectId,
          message: newNote,
          role: "user",
          user_id: userData.user.id
        });

      if (insertError) throw insertError;

      toast.success("Note added successfully");
      setNewNote(""); // Clear the input after successful addition
      onNoteAdded(); // Refresh the notes list
    } catch (error: any) {
      console.error("Error adding note:", error);
      toast.error(error.message || "Failed to add note");
    }
  };

  return (
    <div className="w-full">
      <RichTextEditor content={newNote} onChange={setNewNote} useTemplate={false} />
      <div className="flex justify-end mt-4">
        <Button onClick={handleAddNote} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </div>
    </div>
  );
};