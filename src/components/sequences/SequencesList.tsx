import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { useState } from "react";
import { DeleteSequenceDialog } from "./DeleteSequenceDialog";
import { EditSequenceDialog } from "./EditSequenceDialog";
import { ViewSequenceDialog } from "./ViewSequenceDialog";
import { CreateSequenceDialog } from "./CreateSequenceDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface Sequence {
  id: string;
  name: string;
  description: string | null;
  status: string;
  sequence_steps: Array<any>;
  sequence_assignments: Array<any>;
}

interface SequencesListProps {
  sequences: Sequence[];
}

export const SequencesList = ({ sequences }: SequencesListProps) => {
  const [selectedSequence, setSelectedSequence] = useState<Sequence | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async (sequence: Sequence) => {
    try {
      const { error } = await supabase.rpc('delete_sequence', {
        p_sequence_id: sequence.id,
        p_user_id: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['sequences'] });
      toast.success("Sequence deleted successfully");
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting sequence:", error);
      toast.error("Failed to delete sequence");
    }
  };

  if (!sequences?.length) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Sequences</h1>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Sequence
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground">No sequences found</p>
          <p className="text-sm text-muted-foreground">
            Create a sequence to get started
          </p>
        </div>
        <CreateSequenceDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sequences</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Sequence
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Steps</TableHead>
            <TableHead>Prospects</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sequences.map((sequence) => (
            <TableRow key={sequence.id}>
              <TableCell>{sequence.name}</TableCell>
              <TableCell>{sequence.description}</TableCell>
              <TableCell>{sequence.sequence_steps?.length || 0}</TableCell>
              <TableCell>{sequence.sequence_assignments?.length || 0}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    sequence.status === "active"
                      ? "default"
                      : sequence.status === "paused"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {sequence.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedSequence(sequence);
                      setViewDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedSequence(sequence);
                      setEditDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedSequence(sequence);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedSequence && (
        <>
          <DeleteSequenceDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            sequence={selectedSequence}
            onDelete={handleDelete}
          />
          <EditSequenceDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            sequence={selectedSequence}
          />
          <ViewSequenceDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            sequence={selectedSequence}
          />
        </>
      )}
      <CreateSequenceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
};