import { Table, TableBody } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Prospect, EditableProspect } from "../types/prospect";
import { ProspectTableHeader } from "./ProspectTableHeader";
import { ProspectRow } from "./ProspectRow";
import { Button } from "@/components/ui/button";
import { Filter, Plus, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ProspectsTableProps {
  prospects: Prospect[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showConverted?: boolean;
  onShowConvertedChange?: (show: boolean) => void;
  onSearch?: (term: string) => void;
  onFilter?: (filters: { source?: string }) => void;
  onUpdate?: (id: string, data: Partial<Prospect>) => Promise<void>;
  isLoading?: boolean;
}

export const ProspectsTable = ({
  prospects,
  onUpdate,
  isLoading,
}: ProspectsTableProps) => {
  const [editableProspects, setEditableProspects] = useState<EditableProspect[]>([]);
  const [editValues, setEditValues] = useState<Record<string, Partial<Prospect>>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setEditableProspects(prospects.map(p => ({ ...p, isEditing: false })));
  }, [prospects]);

  const startEditing = (prospect: EditableProspect) => {
    setEditableProspects(prev => 
      prev.map(p => ({
        ...p,
        isEditing: p.id === prospect.id
      }))
    );
    setEditValues(prev => ({
      ...prev,
      [prospect.id]: { ...prospect }
    }));
  };

  const cancelEditing = (prospectId: string) => {
    setEditableProspects(prev =>
      prev.map(p => ({
        ...p,
        isEditing: p.id === prospectId ? false : p.isEditing
      }))
    );
    setEditValues(prev => {
      const newValues = { ...prev };
      delete newValues[prospectId];
      return newValues;
    });
  };

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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          {selectedIds.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedIds.length} selected
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Import CSV
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Prospects</DialogTitle>
              </DialogHeader>
              {/* CSV upload content */}
            </DialogContent>
          </Dialog>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Prospect
          </Button>
        </div>
      </div>

      <Table>
        <ProspectTableHeader
          onSelectAll={handleSelectAll}
          isAllSelected={selectedIds.length === prospects.length}
        />
        <TableBody>
          {editableProspects.map((prospect) => (
            <ProspectRow
              key={prospect.id}
              prospect={prospect}
              sourceLabels={sourceLabels}
              onUpdate={onUpdate!}
              editValues={editValues}
              setEditValues={setEditValues}
              startEditing={startEditing}
              cancelEditing={cancelEditing}
              isSelected={selectedIds.includes(prospect.id)}
              onSelectChange={(checked) => handleSelectChange(prospect.id, checked)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};