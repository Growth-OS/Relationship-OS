import { memo } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { SequenceActions } from "./SequenceActions";
import { type Sequence } from "../types";

interface SequenceListItemProps {
  sequence: Sequence;
  onStatusChange: (sequenceId: string, newStatus: 'active' | 'paused' | 'completed') => Promise<void>;
  onDelete: (sequenceId: string, sequenceName: string) => Promise<void>;
  isUpdating: boolean;
}

export const SequenceListItem = memo(({ 
  sequence, 
  onStatusChange, 
  onDelete,
  isUpdating 
}: SequenceListItemProps) => {
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
    <TableRow>
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
          isUpdating={isUpdating}
          onStatusChange={(newStatus) => onStatusChange(sequence.id, newStatus)}
          onDelete={() => onDelete(sequence.id, sequence.name)}
        />
      </TableCell>
    </TableRow>
  );
});

SequenceListItem.displayName = 'SequenceListItem';