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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ProspectsTableProps {
  prospects: Prospect[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showConverted: boolean;
  onShowConvertedChange: (show: boolean) => void;
}

export const ProspectsTable = ({
  prospects,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  showConverted,
  onShowConvertedChange,
}: ProspectsTableProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { handleDelete, handleConvertToLead } = useProspectOperations();

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
    console.log("Edit prospect:", prospect);
  };

  if (isLoading) return <TableLoadingState />;
  if (!prospects.length) return <TableEmptyState />;

  const sourceLabels: Record<string, string> = {
    website: 'Website',
    referral: 'Referral',
    linkedin: 'LinkedIn',
    cold_outreach: 'Cold Outreach',
    conference: 'Conference',
    accelerator: 'Accelerator',
    other: 'Other'
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <BulkActions
          selectedIds={selectedIds}
          allSelected={selectedIds.length === prospects.length}
          onSelectAll={handleSelectAll}
        />
        <div className="flex items-center space-x-2">
          <Switch
            id="show-converted"
            checked={showConverted}
            onCheckedChange={onShowConvertedChange}
          />
          <Label htmlFor="show-converted">Show converted prospects</Label>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-left align-top"></TableHead>
              <TableHead className="w-[300px] text-left align-top">Company</TableHead>
              <TableHead className="text-left align-top">Source</TableHead>
              <TableHead className="text-left align-top">Job Title</TableHead>
              <TableHead className="text-left align-top">Email</TableHead>
              <TableHead className="text-left align-top">LinkedIn</TableHead>
              <TableHead className="w-[100px] text-left align-top"></TableHead>
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