import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileIcon, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { CreateTransactionForm } from "./CreateTransactionForm";
import { FinancialTransaction } from "@/integrations/supabase/types/finances";

interface TransactionsListProps {
  type?: 'income' | 'expense';
}

export const TransactionsList = ({ type }: TransactionsListProps) => {
  const [editingTransaction, setEditingTransaction] = useState<FinancialTransaction | null>(null);

  const { data: transactions, isLoading, refetch } = useQuery({
    queryKey: ['transactions', type],
    queryFn: async () => {
      let query = supabase
        .from('financial_transactions')
        .select(`
          *,
          transaction_attachments (
            id,
            file_name,
            file_path
          )
        `)
        .order('date', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
  });

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('financial_docs')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Error downloading file');
    }
  };

  const handleDelete = async (transactionId: string) => {
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', transactionId);

      if (error) throw error;

      toast.success('Transaction deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Error deleting transaction');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Files</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{format(new Date(transaction.date), 'MMM d, yyyy')}</TableCell>
              <TableCell className="capitalize">{transaction.type}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{transaction.category}</TableCell>
              <TableCell className="text-right">
                €{Number(transaction.amount).toFixed(2)}
              </TableCell>
              <TableCell>
                {transaction.transaction_attachments?.map((attachment) => (
                  <Button
                    key={attachment.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(attachment.file_path, attachment.file_name)}
                  >
                    <FileIcon className="h-4 w-4 mr-1" />
                    {attachment.file_name}
                  </Button>
                ))}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setEditingTransaction(transaction)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(transaction.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog 
        open={!!editingTransaction} 
        onOpenChange={(open) => {
          if (!open) {
            setEditingTransaction(null);
            refetch(); // Refetch transactions when dialog closes
          }
        }}
      >
        <DialogContent className="max-w-lg">
          {editingTransaction && (
            <CreateTransactionForm 
              initialData={editingTransaction}
              onSuccess={() => {
                setEditingTransaction(null);
                refetch();
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};