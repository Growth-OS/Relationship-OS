import { Table, TableBody } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Lead } from "./types/lead";
import { EditableLead } from "./types/lead";
import { LeadTableHeader } from "./table/LeadTableHeader";
import { LeadRow } from "./table/LeadRow";
import { TablePagination } from "@/components/prospects/components/TablePagination";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { CSVUploadDialog } from "./components/CSVUploadDialog";

interface LeadsTableProps {
  leads: Lead[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch?: (term: string) => void;
  onFilter?: (filters: { source?: string }) => void;
  isLoading?: boolean;
}

export const LeadsTable = ({
  leads,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: LeadsTableProps) => {
  const [editableLeads, setEditableLeads] = useState<EditableLead[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    setEditableLeads(leads.map(p => ({ ...p, isEditing: false })));
  }, [leads]);

  const handleSelectAll = () => {
    if (selectedIds.length === leads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(leads.map(p => p.id));
    }
  };

  const handleSelectChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(prevId => prevId !== id));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Lead deleted successfully");
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error("Failed to delete lead");
    }
  };

  const handleEdit = async (lead: Lead) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update(lead)
        .eq('id', lead.id);

      if (error) throw error;

      toast.success("Lead updated successfully");
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error("Failed to update lead");
    }
  };

  const sourceLabels: Record<string, string> = {
    linkedin: "LinkedIn",
    referral: "Referral",
    website: "Website",
    cold_outreach: "Cold Outreach",
    conference: "Conference",
    other: "Other"
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Upload Leads CSV</DialogTitle>
            </DialogHeader>
            <CSVUploadDialog onSuccess={() => {
              setUploadDialogOpen(false);
              toast.success("Leads uploaded successfully");
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <LeadTableHeader />
        <TableBody>
          {editableLeads.map((lead) => (
            <LeadRow
              key={lead.id}
              lead={lead}
              sourceLabels={sourceLabels}
              onDelete={handleDelete}
              onEdit={handleEdit}
              isSelected={selectedIds.includes(lead.id)}
              onSelectChange={(checked) => handleSelectChange(lead.id, checked)}
            />
          ))}
        </TableBody>
      </Table>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};