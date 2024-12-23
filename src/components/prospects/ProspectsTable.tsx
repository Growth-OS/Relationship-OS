import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { EditProspectForm } from "./EditProspectForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Prospect {
  id: string;
  company_name: string;
  contact_email?: string;
  contact_job_title?: string;
  source: 'website' | 'referral' | 'linkedin' | 'cold_outreach' | 'conference' | 'other';
  notes?: string;
  status?: string;
}

interface ProspectsTableProps {
  prospects: Prospect[];
  onProspectUpdated: () => void;
}

export const ProspectsTable = ({ prospects, onProspectUpdated }: ProspectsTableProps) => {
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);

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

      // Create the deal with all available prospect data
      const { error: dealError } = await supabase
        .from('deals')
        .insert({
          company_name: prospect.company_name,
          contact_email: prospect.contact_email || null,
          contact_job_title: prospect.contact_job_title || null,
          notes: prospect.notes || null,
          source: prospect.source,
          user_id: user.id,
          stage: 'lead',
          deal_value: 0,
          last_activity_date: new Date().toISOString()
        });

      if (dealError) throw dealError;

      // Update the prospect status to 'converted' instead of deleting
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

  const sourceLabels = {
    website: 'Website',
    referral: 'Referral',
    linkedin: 'LinkedIn',
    cold_outreach: 'Cold Outreach',
    conference: 'Conference',
    other: 'Other'
  };

  // Filter to show only active prospects in the table
  const activeProspects = prospects.filter(prospect => prospect.status !== 'converted');

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeProspects.map((prospect) => (
            <TableRow key={prospect.id}>
              <TableCell className="font-medium">{prospect.company_name}</TableCell>
              <TableCell>{sourceLabels[prospect.source]}</TableCell>
              <TableCell>{prospect.contact_job_title || '-'}</TableCell>
              <TableCell>{prospect.contact_email || '-'}</TableCell>
              <TableCell className="max-w-[200px] truncate">{prospect.notes || '-'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingProspect(prospect)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(prospect.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleConvertToLead(prospect)}
                    title="Convert to Lead"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingProspect && (
        <Dialog open={!!editingProspect} onOpenChange={() => setEditingProspect(null)}>
          <DialogContent>
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
    </>
  );
};