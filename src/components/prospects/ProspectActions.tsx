import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowRight, Play } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface ProspectActionsProps {
  prospect: {
    id: string;
    company_name: string;
    contact_email?: string;
    contact_job_title?: string;
    contact_linkedin?: string;
    source: 'website' | 'referral' | 'linkedin' | 'cold_outreach' | 'conference' | 'other';
    notes?: string;
  };
  onDelete: (id: string) => Promise<void>;
  onConvertToLead: (prospect: any) => Promise<void>;
  onEdit: (prospect: any) => void;
}

export const ProspectActions = ({ prospect, onDelete, onConvertToLead, onEdit }: ProspectActionsProps) => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState<string>("");

  const { data: sequences = [] } = useQuery({
    queryKey: ['sequences'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('sequences')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');
      
      if (error) throw error;
      return data;
    },
  });

  const handleAssignToSequence = async () => {
    try {
      if (!selectedSequence) {
        toast.error('Please select a sequence');
        return;
      }

      const { error } = await supabase
        .from('sequence_assignments')
        .insert({
          sequence_id: selectedSequence,
          prospect_id: prospect.id,
          current_step: 1,
          status: 'active'
        });

      if (error) throw error;

      toast.success('Prospect assigned to sequence successfully');
      setIsAssignDialogOpen(false);
    } catch (error) {
      console.error('Error assigning prospect to sequence:', error);
      toast.error('Error assigning prospect to sequence');
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(prospect)}
        className="hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <Pencil className="h-4 w-4 text-gray-600" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(prospect.id)}
        className="hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onConvertToLead(prospect)}
        className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
        title="Convert to Lead"
      >
        <ArrowRight className="h-4 w-4 text-purple-600" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsAssignDialogOpen(true)}
        className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
        title="Assign to Sequence"
      >
        <Play className="h-4 w-4 text-blue-600" />
      </Button>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign to Sequence</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select onValueChange={setSelectedSequence}>
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
            <Button onClick={handleAssignToSequence}>
              Assign
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};