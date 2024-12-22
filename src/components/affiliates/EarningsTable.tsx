import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EuroIcon } from "lucide-react";
import { AddEarningForm } from "./AddEarningForm";
import { useState } from "react";

type Earning = {
  id: string;
  date: string;
  amount: number;
  notes: string | null;
  affiliate_partners: {
    name: string;
  };
};

type EarningsTableProps = {
  earnings: Earning[];
  isLoading: boolean;
};

export const EarningsTable = ({ earnings, isLoading }: EarningsTableProps) => {
  const [isAddEarningOpen, setIsAddEarningOpen] = useState(false);

  if (isLoading) {
    return <div className="text-center py-4">Loading earnings...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Recent Earnings</h3>
        <Dialog open={isAddEarningOpen} onOpenChange={setIsAddEarningOpen}>
          <DialogTrigger asChild>
            <Button>
              <EuroIcon className="w-4 h-4 mr-2" />
              Add Earnings
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Earnings</DialogTitle>
            </DialogHeader>
            <AddEarningForm 
              onSuccess={() => setIsAddEarningOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {!earnings?.length ? (
        <div className="text-center py-4 text-gray-500">
          No earnings recorded yet. Click "Add Earnings" to get started.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Partner</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {earnings.map((earning) => (
              <TableRow key={earning.id}>
                <TableCell>{new Date(earning.date).toLocaleDateString()}</TableCell>
                <TableCell>{earning.affiliate_partners?.name}</TableCell>
                <TableCell>€{Number(earning.amount).toFixed(2)}</TableCell>
                <TableCell>{earning.notes || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};