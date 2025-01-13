import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ProspectTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12 text-left">Select</TableHead>
        <TableHead className="text-left">Company</TableHead>
        <TableHead className="text-left">Source</TableHead>
        <TableHead className="text-left">Job Title</TableHead>
        <TableHead className="text-left">Email</TableHead>
        <TableHead className="text-left">Website</TableHead>
        <TableHead className="text-left">LinkedIn</TableHead>
        <TableHead className="text-left">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};