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
        <TableHead className="text-left text-sm font-medium text-muted-foreground">Company</TableHead>
        <TableHead className="text-left text-sm font-medium text-muted-foreground">Source</TableHead>
        <TableHead className="text-left text-sm font-medium text-muted-foreground">Job Title</TableHead>
        <TableHead className="text-left text-sm font-medium text-muted-foreground">Email</TableHead>
        <TableHead className="text-left text-sm font-medium text-muted-foreground">LinkedIn</TableHead>
        <TableHead className="text-left text-sm font-medium text-muted-foreground">Website</TableHead>
        <TableHead className="text-left text-sm font-medium text-muted-foreground">Status</TableHead>
        <TableHead className="text-left text-sm font-medium text-muted-foreground">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};