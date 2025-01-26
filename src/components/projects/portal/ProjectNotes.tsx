import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { StickyNote } from "lucide-react";
import { toast } from "sonner";
import { NoteEditor } from "./notes/NoteEditor";
import { NotesList } from "./notes/NotesList";

interface ProjectNotesProps {
  projectId: string;
}

export const ProjectNotes = ({ projectId }: ProjectNotesProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 8;

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
          </div>

          <NoteEditor projectId={projectId} onNoteAdded={refetch} />

          <NotesList
            notes={paginatedNotes}
            currentPage={currentPage}
            totalPages={totalPages}
            onDelete={handleDeleteNote}
            onPageChange={setCurrentPage}
          />
        </div>
      </Card>
    </div>
  );
};