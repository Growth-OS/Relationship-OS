import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Prospect } from "@/types/prospects";

interface ProspectsListProps {
  prospects: Prospect[];
  isLoading: boolean;
}

export const ProspectsList = ({ prospects, isLoading }: ProspectsListProps) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading prospects...</div>;
  }

  if (!prospects.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No prospects found. Create your first prospect to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prospects.map((prospect) => (
            <TableRow 
              key={prospect.id}
              className="cursor-pointer hover:bg-gray-50"
            >
              <TableCell className="font-medium">{prospect.company_name}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{prospect.first_name}</span>
                  <span className="text-sm text-gray-500">{prospect.contact_email}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {prospect.source}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={prospect.is_converted_to_deal ? "secondary" : "default"}
                  className={prospect.is_converted_to_deal ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                >
                  {prospect.is_converted_to_deal ? "Converted" : "Active"}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(prospect.created_at), 'MMM d, yyyy')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};