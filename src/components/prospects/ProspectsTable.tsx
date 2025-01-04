import { useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProspectRow } from "./components/ProspectRow";
import { BulkActions } from "./components/BulkActions";
import { TablePagination } from "./components/TablePagination";
import { TableLoadingState } from "./components/TableLoadingState";
import { TableEmptyState } from "./components/TableEmptyState";
import type { Prospect } from "./types/prospect";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProspectsTableProps {
  prospects: Prospect[];
  isLoading: boolean;
  onEdit: (prospect: Prospect) => void;
  refetch: () => void;
}

export const ProspectsTable = ({
  prospects,
  isLoading,
  onEdit,
  refetch,
}: ProspectsTableProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      const { error } = await supabase.from("prospects").delete().eq("id", id);
      if (error) throw error;
      toast.success("Prospect deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting prospect:", error);
      toast.error("Failed to delete prospect");
    }
  };

  const handleAssignSequence = async (sequenceId: string) => {
    try {
      const { error } = await supabase.from("sequence_assignments").insert(
        selectedIds.map((prospectId) => ({
          sequence_id: sequenceId,
          prospect_id: prospectId,
        }))
      );
      if (error) throw error;
      toast.success("Prospects assigned to sequence");
      setSelectedIds([]);
    } catch (error) {
      console.error("Error assigning sequence:", error);
      toast.error("Failed to assign sequence");
    }
  };

  const totalPages = Math.ceil(prospects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProspects = prospects.slice(startIndex, endIndex);

  if (isLoading) return <TableLoadingState />;
  if (!prospects.length) return <TableEmptyState />;

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
              <TableHead>Email</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProspects.map((prospect) => (
              <ProspectRow
                key={prospect.id}
                prospect={prospect}
                isSelected={selectedIds.includes(prospect.id)}
                onSelect={handleSelect}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};