import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditProspectForm } from "./EditProspectForm";
import { ProspectRow } from "./ProspectRow";
import { useState } from "react";
import { BulkActions } from "./components/BulkActions";
import { TablePagination } from "./components/TablePagination";
import { TableLoadingState } from "./components/TableLoadingState";
import { TableEmptyState } from "./components/TableEmptyState";
import type { Prospect } from "./types/prospect";

interface ProspectsTableProps {
  prospects: Prospect[];
  onProspectUpdated: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export const ProspectsTable = ({ 
  prospects, 
  onProspectUpdated, 
  currentPage, 
  totalPages, 
  onPageChange,
  isLoading 
}: ProspectsTableProps) => {
  const [editingProspect, setEditingProspect] = useState<Prospect | null>(null);
  const [selectedProspects, setSelectedProspects] = useState<Set<string>>(new Set());

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
  const selectedProspectsData = Array.from(selectedProspects).map(id => 
    prospects.find(p => p.id === id)!
  );

  return (
    <>
      <BulkActions 
        selectedProspects={selectedProspectsData}
        onSuccess={() => {
          setSelectedProspects(new Set());
          onProspectUpdated();
        }}
      />

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
            {isLoading ? (
              <TableLoadingState />
            ) : activeProspects.length === 0 ? (
              <TableEmptyState />
            ) : (
              activeProspects.map((prospect) => (
                <ProspectRow
                  key={prospect.id}
                  prospect={prospect}
                  sourceLabels={sourceLabels}
                  onDelete={async (id) => {
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
                  }}
                  onConvertToLead={async (prospect) => {
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
                  }}
                  onEdit={setEditingProspect}
                  isSelected={selectedProspects.has(prospect.id)}
                  onSelectChange={(checked) => handleSelectProspect(prospect.id, checked)}
                />
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
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
