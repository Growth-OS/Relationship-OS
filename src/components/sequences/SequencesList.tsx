import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Pause, Settings, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { type Sequence } from "./types";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface SequencesListProps {
  sequences: Sequence[];
  isLoading: boolean;
}

export const SequencesList = ({ sequences = [], isLoading }: SequencesListProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleStatusChange = async (sequenceId: string, newStatus: 'active' | 'paused') => {
    try {
      console.log('Updating sequence status:', { sequenceId, newStatus });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to update sequences');
        return;
      }

      const { error } = await supabase
        .from('sequences')
        .update({ status: newStatus })
        .eq('id', sequenceId)
        .eq('user_id', user.id); // Added user_id check

      if (error) {
        console.error('Error updating sequence status:', error);
        throw error;
      }

      // Verify the update
      const { data: verifySequence, error: verifyError } = await supabase
        .from('sequences')
        .select('*')
        .eq('id', sequenceId)
        .single();

      if (verifyError) {
        console.error('Verification error:', verifyError);
        throw verifyError;
      }

      console.log('Verified sequence update:', verifySequence);

      toast.success(`Sequence ${newStatus === 'active' ? 'activated' : 'paused'} successfully`);
      await queryClient.invalidateQueries({ queryKey: ['sequences'] });
    } catch (error) {
      console.error('Error updating sequence status:', error);
      toast.error('Failed to update sequence status');
    }
  };

  const handleDelete = async (sequenceId: string) => {
    try {
      console.log('Starting sequence deletion process for ID:', sequenceId);

      // First, delete all sequence history records
      const { error: historyError } = await supabase
        .from('sequence_history')
        .delete()
        .eq('assignment_id', (
          supabase
            .from('sequence_assignments')
            .select('id')
            .eq('sequence_id', sequenceId)
        ));

      if (historyError) {
        console.error('Error deleting sequence history:', historyError);
        throw historyError;
      }

      // Then, delete all sequence assignments
      const { error: assignmentsError } = await supabase
        .from('sequence_assignments')
        .delete()
        .eq('sequence_id', sequenceId);

      if (assignmentsError) {
        console.error('Error deleting sequence assignments:', assignmentsError);
        throw assignmentsError;
      }

      // Next, delete all sequence steps
      const { error: stepsError } = await supabase
        .from('sequence_steps')
        .delete()
        .eq('sequence_id', sequenceId);

      if (stepsError) {
        console.error('Error deleting sequence steps:', stepsError);
        throw stepsError;
      }

      // Finally, delete the sequence itself
      const { error: sequenceError } = await supabase
        .from('sequences')
        .delete()
        .eq('id', sequenceId);

      if (sequenceError) {
        console.error('Error deleting sequence:', sequenceError);
        throw sequenceError;
      }

      toast.success('Sequence deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['sequences'] });
    } catch (error) {
      console.error('Error in deletion process:', error);
      toast.error('Failed to delete sequence. Please try again.');
    }
  };

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
              <TableCell className="text-right space-x-2">
                {sequence.status === "active" ? (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Pause sequence"
                    onClick={() => handleStatusChange(sequence.id, 'paused')}
                  >
                    <Pause className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Activate sequence"
                    onClick={() => handleStatusChange(sequence.id, 'active')}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  title="Sequence settings"
                  onClick={() => navigate(`/dashboard/sequences/${sequence.id}/edit`)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      title="Delete sequence"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Sequence</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this sequence? This action cannot be undone and will remove all associated steps and assignments.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => handleDelete(sequence.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};