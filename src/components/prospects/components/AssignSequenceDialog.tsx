import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Prospect } from "../types/prospect";

interface AssignSequenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign?: (sequenceId: string) => Promise<void>;
  prospects?: Prospect[];
  onSuccess?: () => void;
}

export const AssignSequenceDialog = ({ 
  open, 
  onOpenChange, 
  onAssign,
  prospects,
  onSuccess 
}: AssignSequenceDialogProps) => {
  const [selectedSequence, setSelectedSequence] = useState<string>("");

  const { data: sequences = [], isLoading } = useQuery({
    queryKey: ['sequences'],
    queryFn: async () => {
      console.log('Fetching sequences for assignment dialog');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('sequences')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .eq('is_deleted', false);
      
      if (error) {
        console.error('Error fetching sequences:', error);
        throw error;
      }

      console.log('Available sequences:', data);
      return data || [];
    },
  });

  const handleAssign = async () => {
    try {
      if (!selectedSequence) {
        toast.error('Please select a sequence');
        return;
      }

      console.log('Assigning sequence:', selectedSequence);
      console.log('To prospects:', prospects);

      if (onAssign) {
        await onAssign(selectedSequence);
        if (onSuccess) {
          onSuccess();
        }
        toast.success('Prospects assigned to sequence successfully');
        setSelectedSequence("");
      }
    } catch (error) {
      console.error('Error assigning sequence:', error);
      toast.error('Failed to assign sequence');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) setSelectedSequence("");
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign to Sequence</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isLoading ? (
            <div>Loading sequences...</div>
          ) : sequences.length === 0 ? (
            <div className="text-center text-gray-500">
              No active sequences found. Please create a sequence first.
            </div>
          ) : (
            <Select value={selectedSequence} onValueChange={setSelectedSequence}>
              <SelectTrigger>
                <SelectValue placeholder="Select a sequence" />
              </SelectTrigger>
              <SelectContent>
                {sequences.map((sequence) => (
                  <SelectItem key={sequence.id} value={sequence.id}>
                    {sequence.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button 
            onClick={handleAssign} 
            disabled={!selectedSequence || isLoading}
            className="w-full"
          >
            Assign to Sequence
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};