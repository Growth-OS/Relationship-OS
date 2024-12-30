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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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

  const truncateFileName = (fileName: string, maxLength: number = 20) => {
    if (fileName.length <= maxLength) return fileName;
    const extension = fileName.split('.').pop();
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    const truncated = nameWithoutExt.substring(0, maxLength - 4) + '...';
    return `${truncated}.${extension}`;
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
                <div className="flex flex-wrap gap-2">
                  {transaction.transaction_attachments?.map((attachment) => (
                    <Tooltip key={attachment.id}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(attachment.file_path, attachment.file_name)}
                          className="h-8 px-2"
                        >
                          <FileIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="truncate max-w-[150px]">
                            {truncateFileName(attachment.file_name)}
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{attachment.file_name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
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