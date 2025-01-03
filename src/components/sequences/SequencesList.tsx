import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { type Sequence } from "./types";
import { SequenceActions } from "./components/SequenceActions";
import { useSequenceOperations } from "./hooks/useSequenceOperations";

interface SequencesListProps {
  sequences: Sequence[];
  isLoading: boolean;
}

export const SequencesList = ({ sequences = [], isLoading }: SequencesListProps) => {
  const { handleStatusChange, handleDelete } = useSequenceOperations();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
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
        {sequences.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              No sequences found. Create your first sequence to get started.
            </TableCell>
          </TableRow>
        ) : (
          sequences.map((sequence) => (
            <TableRow key={sequence.id}>
              <TableCell className="font-medium">{sequence.name}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(sequence.status)}>
                  {sequence.status}
                </Badge>
              </TableCell>
              <TableCell>
                {(sequence.sequence_steps?.reduce((total, step) => total + (step.count || 0), 0) || 0)} / {sequence.max_steps || 5}
              </TableCell>
              <TableCell>
                {sequence.sequence_assignments?.length || 0} prospects
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(sequence.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-right">
                <SequenceActions
                  sequenceId={sequence.id}
                  status={sequence.status}
                  onStatusChange={(newStatus) => handleStatusChange(sequence.id, newStatus)}
                  onDelete={() => handleDelete(sequence.id)}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};