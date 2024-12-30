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
  contact_linkedin?: string;
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
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800/50">
              <TableHead className="font-semibold">Company</TableHead>
              <TableHead className="font-semibold">Source</TableHead>
              <TableHead className="font-semibold">Job Title</TableHead>
              <TableHead className="font-semibold">Email</TableHead>
              <TableHead className="font-semibold">LinkedIn</TableHead>
              <TableHead className="font-semibold">Notes</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeProspects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No prospects found. Add your first prospect to get started.
                </TableCell>
              </TableRow>
            ) : (
              activeProspects.map((prospect) => (
                <TableRow key={prospect.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <TableCell className="font-medium">{prospect.company_name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {sourceLabels[prospect.source]}
                    </span>
                  </TableCell>
                  <TableCell>{prospect.contact_job_title || '-'}</TableCell>
                  <TableCell>{prospect.contact_email || '-'}</TableCell>
                  <TableCell>
                    {prospect.contact_linkedin ? (
                      <a 
                        href={prospect.contact_linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 hover:underline"
                      >
                        View Profile
                      </a>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {prospect.notes ? (
                      <span title={prospect.notes}>{prospect.notes}</span>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingProspect(prospect)}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Pencil className="h-4 w-4 text-gray-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(prospect.id)}
                        className="hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleConvertToLead(prospect)}
                        className="hover:bg-purple-50 dark:hover:bg-purple-900/20"
                        title="Convert to Lead"
                      >
                        <ArrowRight className="h-4 w-4 text-purple-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
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
    </>
  );
};