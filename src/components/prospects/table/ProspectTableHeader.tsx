import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface ProspectTableHeaderProps {
  onSelectAll?: () => void;
  isAllSelected?: boolean;
}

export const ProspectTableHeader = ({ onSelectAll, isAllSelected }: ProspectTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px] text-center">
          <div className="flex items-center justify-center">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={onSelectAll}
            />
          </div>
        </TableHead>
        <TableHead>Company</TableHead>
        <TableHead>Source</TableHead>
        <TableHead>Job Title</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Links</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};