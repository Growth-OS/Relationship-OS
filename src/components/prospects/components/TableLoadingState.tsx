import { TableCell, TableRow } from "@/components/ui/table";

export const TableLoadingState = () => (
  <TableRow>
    <TableCell colSpan={10} className="text-center py-8">
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </TableCell>
  </TableRow>
);