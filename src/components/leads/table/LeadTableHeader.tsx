import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

export const LeadTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]">
          <span className="sr-only">Select</span>
        </TableHead>
        <TableHead>Company</TableHead>
        <TableHead>Contact</TableHead>
        <TableHead>Source</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};