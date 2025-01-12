import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ProspectTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Company</TableHead>
        <TableHead>Source</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};