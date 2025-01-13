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
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
            className="ml-4"
          />
        </TableHead>
        <TableHead>Company</TableHead>
        <TableHead>Source</TableHead>
        <TableHead>Job Title</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Website</TableHead>
        <TableHead>LinkedIn</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};