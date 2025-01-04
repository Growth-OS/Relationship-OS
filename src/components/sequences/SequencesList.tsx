import { useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useSequenceOperations } from "./hooks/useSequenceOperations";
import { useSequenceList } from "./hooks/useSequenceList";
import { SequenceListItem } from "./components/SequenceListItem";

export const SequencesList = () => {
  const { sequences, isLoading, handleStatusChange } = useSequenceList();
  const { deleteSequence, isDeleting } = useSequenceOperations();
  const [updatingStatuses, setUpdatingStatuses] = useState<Record<string, boolean>>({});

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  const handleStatusUpdate = async (sequenceId: string, newStatus: 'active' | 'paused' | 'completed') => {
    setUpdatingStatuses(prev => ({ ...prev, [sequenceId]: true }));
    await handleStatusChange(sequenceId, newStatus);
    setUpdatingStatuses(prev => ({ ...prev, [sequenceId]: false }));
  };

  const handleDelete = async (sequenceId: string, sequenceName: string) => {
    try {
      await deleteSequence(sequenceId, sequenceName);
    } catch (error) {
      console.error('Error deleting sequence:', error);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Steps</TableHead>
          <TableHead>Prospects</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sequences?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              No sequences found. Create your first sequence to get started.
            </TableCell>
          </TableRow>
        ) : (
          sequences?.map((sequence) => (
            <SequenceListItem
              key={sequence.id}
              sequence={sequence}
              onStatusChange={handleStatusUpdate}
              onDelete={handleDelete}
              isUpdating={updatingStatuses[sequence.id] || isDeleting}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};