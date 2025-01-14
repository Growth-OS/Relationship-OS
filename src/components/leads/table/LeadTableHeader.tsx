import { TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface LeadTableHeaderProps {
  isAllSelected?: boolean;
  onSelectAll?: (checked: boolean) => void;
}

export const LeadTableHeader = ({ isAllSelected, onSelectAll }: LeadTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]">
          <div className="flex items-center justify-center">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={onSelectAll}
            />
          </div>
        </TableHead>
        <TableHead className="text-left">Company</TableHead>
        <TableHead className="text-left">Source</TableHead>
        <TableHead className="text-left">Contact</TableHead>
        <TableHead className="text-left">LinkedIn</TableHead>
        <TableHead className="text-left">Status</TableHead>
        <TableHead className="text-left">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};