import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
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

  const sourceLabels = {
    website: 'Website',
    referral: 'Referral',
    linkedin: 'LinkedIn',
    cold_outreach: 'Cold Outreach',
    conference: 'Conference',
    other: 'Other'
  };

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
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prospects.map((prospect) => (
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