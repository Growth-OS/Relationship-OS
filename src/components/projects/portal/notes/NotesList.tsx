import { StickyNote } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NoteItem } from "./NoteItem";
import { Button } from "@/components/ui/button";

interface NotesListProps {
  notes: Array<{
    id: string;
    created_at: string;
    message: string;
  }>;
  currentPage: number;
  totalPages: number;
  onDelete: (noteId: string) => void;
  onPageChange: (page: number) => void;
}

export const NotesList = ({ 
  notes, 
  currentPage, 
  totalPages, 
  onDelete,
  onPageChange 
}: NotesListProps) => {
  return (
    <ScrollArea className="h-[500px] rounded-md">
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <StickyNote className="h-12 w-12 mb-4 text-muted-foreground/50" />
          <p className="text-center">No notes yet. Add your first note above.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 p-2">
            {notes.map((note) => (
              <NoteItem key={note.id} note={note} onDelete={onDelete} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
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
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </ScrollArea>
  );
};