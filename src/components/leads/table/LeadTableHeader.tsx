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
        <TableHead className="text-left font-medium">Company</TableHead>
        <TableHead className="text-left font-medium">Contact</TableHead>
        <TableHead className="text-left font-medium">Source</TableHead>
        <TableHead className="text-left font-medium">LinkedIn Status</TableHead>
        <TableHead className="text-right font-medium">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};