import { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProspectRow } from "./ProspectRow";
import { BulkActions } from "./components/BulkActions";
import { TablePagination } from "./components/TablePagination";
import { TableLoadingState } from "./components/TableLoadingState";
import { TableEmptyState } from "./components/TableEmptyState";
import type { Prospect } from "./types/prospect";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface ProspectsTableProps {
  prospects: Prospect[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ProspectsTable = ({
  prospects,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: ProspectsTableProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const handleSelectAll = () => {
    if (selectedIds.length === prospects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(prospects.map((p) => p.id));
    }
  };

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log('Deleting prospect:', id);
      const { error } = await supabase
        .from("prospects")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting prospect:", error);
        throw error;
      }

      // Remove the deleted prospect from selected IDs if it was selected
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
      
      // Invalidate and refetch the prospects query
      await queryClient.invalidateQueries({ queryKey: ['prospects'] });
      
      toast.success("Prospect deleted successfully");
    } catch (error) {
      console.error("Error deleting prospect:", error);
      toast.error("Failed to delete prospect");
    }
  };

  const handleEdit = (prospect: Prospect) => {
    // Implement edit functionality
    console.log("Edit prospect:", prospect);
  };

  const handleAssignSequence = async (sequenceId: string) => {
    try {
      // First check if any of the prospects are already assigned to this sequence
      const { data: existingAssignments, error: checkError } = await supabase
        .from("sequence_assignments")
        .select("prospect_id")
        .eq("sequence_id", sequenceId)
        .in("prospect_id", selectedIds);

      if (checkError) throw checkError;

      // Filter out prospects that are already assigned
      const existingProspectIds = existingAssignments?.map(a => a.prospect_id) || [];
      const prospectsToAssign = selectedIds.filter(id => !existingProspectIds.includes(id));

      if (prospectsToAssign.length === 0) {
        toast.error("Selected prospects are already assigned to this sequence");
        return;
      }

      // Create assignments for remaining prospects
      const { error: insertError } = await supabase
        .from("sequence_assignments")
        .insert(
          prospectsToAssign.map((prospectId) => ({
            sequence_id: sequenceId,
            prospect_id: prospectId,
            status: 'active',
            current_step: 1
          }))
        );

      if (insertError) throw insertError;

      toast.success(
        existingProspectIds.length > 0
          ? "Prospects assigned to sequence (some were already assigned)"
          : "Prospects assigned to sequence"
      );
      setSelectedIds([]);
    } catch (error) {
      console.error("Error assigning sequence:", error);
      toast.error("Failed to assign sequence");
    }
  };

  if (isLoading) return <TableLoadingState />;
  if (!prospects.length) return <TableEmptyState />;

  const sourceLabels: Record<string, string> = {
    website: 'Website',
    referral: 'Referral',
    linkedin: 'LinkedIn',
    cold_outreach: 'Cold Outreach',
    conference: 'Conference',
    other: 'Other'
  };

  return (
    <>
      <BulkActions
        selectedIds={selectedIds}
        allSelected={selectedIds.length === prospects.length}
        onSelectAll={handleSelectAll}
        onAssignSequence={handleAssignSequence}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>LinkedIn</TableHead>
              <TableHead>Sequence</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prospects.map((prospect) => (
              <ProspectRow
                key={prospect.id}
                prospect={prospect}
                sourceLabels={sourceLabels}
                isSelected={selectedIds.includes(prospect.id)}
                onSelectChange={(checked) => {
                  if (checked) {
                    handleSelect(prospect.id);
                  } else {
                    setSelectedIds(selectedIds.filter(id => id !== prospect.id));
                  }
                }}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onConvertToLead={async () => {}}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
};