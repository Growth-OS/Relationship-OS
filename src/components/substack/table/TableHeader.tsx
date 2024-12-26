import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const TableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Title</TableHead>
        <TableHead>Publish Date</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};