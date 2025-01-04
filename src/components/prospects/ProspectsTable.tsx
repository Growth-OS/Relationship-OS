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
import { useProspectOperations } from "./hooks/useProspectOperations";

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
  const { handleDelete, handleConvertToLead, handleAssignSequence } = useProspectOperations();

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

  const handleEdit = (prospect: Prospect) => {
    // Implement edit functionality
    console.log("Edit prospect:", prospect);
  };

  const handleAssignSequenceToProspects = async (sequenceId: string) => {
    const success = await handleAssignSequence(sequenceId, selectedIds);
    if (success) {
      setSelectedIds([]);
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
        onAssignSequence={handleAssignSequenceToProspects}
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
                onConvertToLead={handleConvertToLead}
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
