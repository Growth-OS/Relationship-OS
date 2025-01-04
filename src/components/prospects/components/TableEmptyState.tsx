import { TableCell, TableRow } from "@/components/ui/table";

export const TableEmptyState = () => (
  <TableRow>
    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
      No prospects found. Add your first prospect to get started.
    </TableCell>
  </TableRow>
);