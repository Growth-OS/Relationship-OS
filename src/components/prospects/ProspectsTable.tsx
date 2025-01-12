import { Table, TableBody } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Prospect, EditableProspect } from "@/types/prospects";
import { ProspectTableHeader } from "./table/ProspectTableHeader";
import { ProspectRow } from "./table/ProspectRow";

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
    <Table>
      <ProspectTableHeader />
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
          />
        ))}
      </TableBody>
    </Table>
  );
};