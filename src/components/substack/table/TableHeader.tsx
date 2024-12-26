import {
  TableHead,
  TableRow,
  TableHeader as UITableHeader,
} from "@/components/ui/table";

export const PostTableHeader = () => {
  return (
    <UITableHeader>
      <TableRow>
        <TableHead>Title</TableHead>
        <TableHead>Publish Date</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </UITableHeader>
  );
};