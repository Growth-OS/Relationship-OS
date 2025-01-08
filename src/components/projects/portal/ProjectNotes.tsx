import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { RichTextEditor } from "@/components/content/RichTextEditor";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProjectNotesProps {
  projectId: string;
}

export const ProjectNotes = ({ projectId }: ProjectNotesProps) => {
  const [newNote, setNewNote] = useState("");
  const { toast } = useToast();

  const { data: notes = [], refetch } = useQuery({
    queryKey: ["project-notes", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_chat_history")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      const { error } = await supabase
        .from("project_chat_history")
        .insert({
          project_id: projectId,
          message: newNote,
          role: "note",
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note added successfully",
      });

      setNewNote("");
      refetch();
    } catch (error: any) {
      console.error("Error adding note:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add note",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from("project_chat_history")
        .delete()
        .eq("id", noteId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note deleted successfully",
      });

      refetch();
    } catch (error: any) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <RichTextEditor content={newNote} onChange={setNewNote} useTemplate={false} />
        <div className="flex justify-end">
          <Button onClick={handleAddNote}>Add Note</Button>
        </div>
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {format(new Date(note.created_at), "PPp")}
              </span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Note</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this note? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteNote(note.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: note.message }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};