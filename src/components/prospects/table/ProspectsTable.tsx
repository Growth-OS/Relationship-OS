import { Table, TableBody } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Prospect } from "@/types/prospects";
import { EditableProspect } from "../types/prospect";
import { ProspectTableHeader } from "./ProspectTableHeader";
import { ProspectRow } from "./ProspectRow";
import { CSVUploadDialog } from "../components/CSVUploadDialog";
import { BulkActions } from "../components/BulkActions";
import { TablePagination } from "../components/TablePagination";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProspectsTableProps {
  prospects: Prospect[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showConverted?: boolean;
  onShowConvertedChange?: (show: boolean) => void;
  onSearch?: (term: string) => void;
  onFilter?: (filters: { source?: string }) => void;
  isLoading?: boolean;
}

export const ProspectsTable = ({
  prospects,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: ProspectsTableProps) => {
  const [editableProspects, setEditableProspects] = useState<EditableProspect[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setEditableProspects(prospects.map(p => ({ ...p, isEditing: false })));
  }, [prospects]);

  const handleSelectAll = () => {
    if (selectedIds.length === prospects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(prospects.map(p => p.id));
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
        .from('prospects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Prospect deleted successfully");
    } catch (error) {
      console.error('Error deleting prospect:', error);
      toast.error("Failed to delete prospect");
    }
  };

  const handleEdit = async (prospect: Prospect) => {
    try {
      const { error } = await supabase
        .from('prospects')
        .update(prospect)
        .eq('id', prospect.id);

      if (error) throw error;

      toast.success("Prospect updated successfully");
    } catch (error) {
      console.error('Error updating prospect:', error);
      toast.error("Failed to update prospect");
    }
  };

  const handleConvertToLead = async (prospect: Prospect) => {
    try {
      const { error } = await supabase
        .from('prospects')
        .update({ is_converted_to_deal: true })
        .eq('id', prospect.id);

      if (error) throw error;

      toast.success("Prospect converted to lead successfully");
    } catch (error) {
      console.error('Error converting prospect to lead:', error);
      toast.error("Failed to convert prospect to lead");
    }
  };

  const sourceLabels: Record<string, string> = {
    linkedin: "LinkedIn",
    referral: "Referral",
    website: "Website",
    cold_outreach: "Cold Outreach",
    conference: "Conference",
    accelerator: "Accelerator",
    other: "Other"
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-start mb-4">
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload CSV
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Upload Prospects CSV</DialogTitle>
            </DialogHeader>
            <CSVUploadDialog onSuccess={() => {
              setUploadDialogOpen(false);
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <BulkActions
        selectedIds={selectedIds}
        allSelected={selectedIds.length === prospects.length}
        onSelectAll={handleSelectAll}
        onSuccess={() => setSelectedIds([])}
      />

      <Table>
        <ProspectTableHeader />
        <TableBody>
          {editableProspects.map((prospect) => (
            <ProspectRow
              key={prospect.id}
              prospect={prospect}
              sourceLabels={sourceLabels}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onConvertToLead={handleConvertToLead}
              isSelected={selectedIds.includes(prospect.id)}
              onSelectChange={(checked) => handleSelectChange(prospect.id, checked)}
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