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
        <TableHead className="text-left">Links</TableHead>
        <TableHead className="text-left">Status</TableHead>
        <TableHead className="text-left">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};