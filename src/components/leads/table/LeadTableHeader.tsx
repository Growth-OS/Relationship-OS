import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface LeadTableHeaderProps {
  isAllSelected: boolean;
  onSelectAll: () => void;
}

export const LeadTableHeader = ({
  isAllSelected,
  onSelectAll,
}: LeadTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
          />
        </TableHead>
        <TableHead>Company</TableHead>
        <TableHead>Contact</TableHead>
        <TableHead>Source</TableHead>
        <TableHead>LinkedIn</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};