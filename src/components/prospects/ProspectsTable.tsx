import { Table, TableBody } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Prospect } from "@/types/prospects";
import { EditableProspect } from "./types/prospect";
import { ProspectTableHeader } from "./table/ProspectTableHeader";
import { ProspectRow } from "./table/ProspectRow";
import { CSVUploadDialog } from "./components/CSVUploadDialog";

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
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

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
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
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
    </div>
  );
};