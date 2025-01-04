import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EditProspectForm } from "./EditProspectForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProspectRow } from "./ProspectRow";
import { useState } from "react";
import { AssignSequenceDialog } from "./components/AssignSequenceDialog";
import { Users } from "lucide-react";

interface Prospect {
  id: string;
  company_name: string;
  contact_email?: string;
  contact_job_title?: string;
  contact_linkedin?: string;
  source: 'website' | 'referral' | 'linkedin' | 'cold_outreach' | 'conference' | 'other';
  notes?: string;
  status?: string;
  sequence_name?: string;
  sequence_status?: string;
  current_step?: number;
}

interface ProspectsTableProps {
  prospects: Prospect[];
  onProspectUpdated: () => void;
}

export const ProspectsTable = ({ prospects, onProspectUpdated }: ProspectsTableProps) => {
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);
  const [selectedProspects, setSelectedProspects] = useState<Set<string>>(new Set());
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('prospects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Prospect deleted successfully');
      onProspectUpdated();
    } catch (error) {
      console.error('Error deleting prospect:', error);
      toast.error('Error deleting prospect');
    }
  };

  const handleConvertToLead = async (prospect: Prospect) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to convert prospects');
        return;
      }

      const { error: dealError } = await supabase
        .from('deals')
        .insert({
          company_name: prospect.company_name,
          contact_email: prospect.contact_email || null,
          contact_job_title: prospect.contact_job_title || null,
          contact_linkedin: prospect.contact_linkedin || null,
          notes: prospect.notes || null,
          source: prospect.source,
          user_id: user.id,
          stage: 'lead',
          deal_value: 0,
          last_activity_date: new Date().toISOString()
        });

      if (dealError) throw dealError;

      const { error: updateError } = await supabase
        .from('prospects')
        .update({ status: 'converted' })
        .eq('id', prospect.id);

      if (updateError) throw updateError;

      toast.success('Prospect converted to lead successfully');
      onProspectUpdated();
    } catch (error) {
      console.error('Error converting prospect to lead:', error);
      toast.error('Error converting prospect to lead');
    }
  };

  const handleSelectProspect = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedProspects);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedProspects(newSelected);
  };

  const sourceLabels = {
    website: 'Website',
    referral: 'Referral',
    linkedin: 'LinkedIn',
    cold_outreach: 'Cold Outreach',
    conference: 'Conference',
    other: 'Other'
  };

  const activeProspects = prospects.filter(prospect => prospect.status !== 'converted');

  return (
    <>
      <div className="mb-4 flex justify-end">
        {selectedProspects.size > 0 && (
          <Button
            onClick={() => setIsAssignDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Users className="w-4 h-4 mr-2" />
            Assign {selectedProspects.size} Prospects to Sequence
          </Button>
        )}
      </div>

      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800/50">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead className="font-semibold">Company</TableHead>
              <TableHead className="font-semibold">Source</TableHead>
              <TableHead className="font-semibold">Job Title</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">LinkedIn</TableHead>
              <TableHead className="font-semibold">Sequence</TableHead>
              <TableHead className="font-semibold">Progress</TableHead>
              <TableHead className="font-semibold">Notes</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeProspects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                  No prospects found. Add your first prospect to get started.
                </TableCell>
              </TableRow>
            ) : (
              activeProspects.map((prospect) => (
                <ProspectRow
                  key={prospect.id}
                  prospect={prospect}
                  sourceLabels={sourceLabels}
                  onDelete={handleDelete}
                  onConvertToLead={handleConvertToLead}
                  onEdit={setEditingProspect}
                  isSelected={selectedProspects.has(prospect.id)}
                  onSelectChange={(checked) => handleSelectProspect(prospect.id, checked)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingProspect && (
        <Dialog open={!!editingProspect} onOpenChange={() => setEditingProspect(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Prospect</DialogTitle>
            </DialogHeader>
            <EditProspectForm
              prospect={editingProspect}
              onSuccess={() => {
                setEditingProspect(null);
                onProspectUpdated();
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      <AssignSequenceDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        prospects={Array.from(selectedProspects).map(id => 
          prospects.find(p => p.id === id)!
        )}
        onSuccess={() => {
          setIsAssignDialogOpen(false);
          setSelectedProspects(new Set());
          onProspectUpdated();
        }}
      />
    </>
  );
};