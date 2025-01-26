import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { RichTextEditor } from "@/components/content/RichTextEditor";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, StickyNote, Plus } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface ProjectNotesProps {
  projectId: string;
}

export const ProjectNotes = ({ projectId }: ProjectNotesProps) => {
  const [newNote, setNewNote] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 8;
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

  const totalPages = Math.ceil(notes.length / notesPerPage);
  const paginatedNotes = notes.slice(
    (currentPage - 1) * notesPerPage,
    currentPage * notesPerPage
  );

  return (
    <div className="w-full">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <StickyNote className="h-5 w-5 text-primary" />
              Project Notes
            </h3>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>

          <div className="w-full">
            <RichTextEditor content={newNote} onChange={setNewNote} useTemplate={false} />
            <div className="flex justify-end mt-4">
              <Button onClick={handleAddNote} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Note
              </Button>
            </div>
          </div>

          <ScrollArea className="h-[500px] rounded-md">
            {paginatedNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <StickyNote className="h-12 w-12 mb-4 text-muted-foreground/50" />
                <p className="text-center">No notes yet. Add your first note above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 p-2">
                {paginatedNotes.map((note) => (
                  <Card
                    key={note.id}
                    className="p-4 space-y-3 transition-all hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(note.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
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
                            <AlertDialogAction
                              onClick={() => handleDeleteNote(note.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <div
                      className="prose dark:prose-invert text-sm max-w-none text-left"
                      dangerouslySetInnerHTML={{ __html: note.message }}
                    />
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
};