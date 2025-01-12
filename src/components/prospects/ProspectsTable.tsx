import { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProspectRow } from "./ProspectRow";
import { BulkActions } from "./components/BulkActions";
import { TablePagination } from "./components/TablePagination";
import { TableLoadingState } from "./components/TableLoadingState";
import { TableEmptyState } from "./components/TableEmptyState";
import type { Prospect } from "./types/prospect";
import { useProspectOperations } from "./hooks/useProspectOperations";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSequenceAssignment } from "./hooks/useSequenceAssignment";
import { Search, SlidersHorizontal } from "lucide-react";
import debounce from "lodash/debounce";

interface ProspectsTableProps {
  prospects: Prospect[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showConverted: boolean;
  onShowConvertedChange: (show: boolean) => void;
  onSearch?: (searchTerm: string) => void;
  onFilter?: (filters: { source?: string; status?: string }) => void;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("");
  const { handleDelete, handleConvertToLead } = useProspectOperations();
  const { handleAssignSequence } = useSequenceAssignment();

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

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      console.log("Searching for:", term);
      // Implement your search logic here
    }, 300),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  const sourceLabels: Record<string, string> = {
    website: 'Website',
    referral: 'Referral',
    linkedin: 'LinkedIn',
    cold_outreach: 'Cold Outreach',
    conference: 'Conference',
    accelerator: 'Accelerator',
    other: 'Other'
  };

  if (isLoading) return <TableLoadingState />;
  if (!prospects.length) return <TableEmptyState />;

  return (
    <>
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex justify-between items-center">
          <BulkActions
            selectedIds={selectedIds}
            allSelected={selectedIds.length === prospects.length}
            onSelectAll={handleSelectAll}
            onAssignSequence={handleAssignSequence}
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
        
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search prospects..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All sources</SelectItem>
                {Object.entries(sourceLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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