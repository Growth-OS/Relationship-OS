import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ProspectTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12 p-4 text-left">Select</TableHead>
        <TableHead className="p-4 text-left">Company</TableHead>
        <TableHead className="p-4 text-left">Source</TableHead>
        <TableHead className="p-4 text-left">Job Title</TableHead>
        <TableHead className="p-4 text-left">Email</TableHead>
        <TableHead className="p-4 text-left">Website</TableHead>
        <TableHead className="p-4 text-left">LinkedIn</TableHead>
        <TableHead className="p-4 text-left">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};