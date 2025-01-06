import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowRight, Play } from "lucide-react";
import { useState } from "react";
import { AssignSequenceDialog } from "./components/AssignSequenceDialog";
import type { ProspectActionsProps } from "./types/prospect";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditProspectForm } from "./EditProspectForm";

export const ProspectActions = ({ prospect, onDelete, onEdit }: ProspectActionsProps) => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleConvertToLead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to convert prospects');
        return;
      }

      console.log('Converting prospect to lead:', prospect);

      const { error } = await supabase
        .from('deals')
        .insert({
          user_id: user.id,
          company_name: prospect.company_name,
          contact_email: prospect.contact_email,
          contact_linkedin: prospect.contact_linkedin,
          contact_job_title: prospect.contact_job_title,
          stage: 'lead',
          source: prospect.source,
          notes: prospect.notes
        });

      if (error) {
        console.error('Error converting prospect to lead:', error);
        throw error;
      }

      // Update prospect status
      const { error: updateError } = await supabase
        .from('prospects')
        .update({ status: 'converted' })
        .eq('id', prospect.id);

      if (updateError) {
        console.error('Error updating prospect status:', updateError);
        throw updateError;
      }

      await queryClient.invalidateQueries({ queryKey: ['prospects'] });
      await queryClient.invalidateQueries({ queryKey: ['deals'] });
      
      toast.success('Prospect converted to lead successfully');
    } catch (error) {
      console.error('Error in conversion:', error);
      toast.error('Failed to convert prospect to lead');
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsEditDialogOpen(true)}
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
        onClick={handleConvertToLead}
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

      <AssignSequenceDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        prospects={[prospect]}
        onSuccess={() => {
          setIsAssignDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: ['prospects'] });
        }}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Prospect</DialogTitle>
          </DialogHeader>
          <EditProspectForm 
            prospect={prospect} 
            onSuccess={() => {
              setIsEditDialogOpen(false);
              queryClient.invalidateQueries({ queryKey: ['prospects'] });
            }} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};