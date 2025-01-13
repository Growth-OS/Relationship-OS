import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface ProspectTableHeaderProps {
  isAllSelected?: boolean;
  onSelectAll?: (checked: boolean) => void;
}

export const ProspectTableHeader = ({ isAllSelected, onSelectAll }: ProspectTableHeaderProps) => {
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
        <TableHead className="text-left">Job Title</TableHead>
        <TableHead className="text-left">Email</TableHead>
        <TableHead className="text-left">LinkedIn</TableHead>
        <TableHead className="text-left">Website</TableHead>
        <TableHead className="text-left">Status</TableHead>
        <TableHead className="text-left">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};