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
            file_path,
            file_type
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
      // First, delete any associated attachments from storage
      const { data: attachments } = await supabase
        .from('transaction_attachments')
        .select('file_path')
        .eq('transaction_id', transactionId);

      if (attachments && attachments.length > 0) {
        const filePaths = attachments.map(a => a.file_path);
        const { error: storageError } = await supabase.storage
          .from('financial_docs')
          .remove(filePaths);

        if (storageError) throw storageError;
      }

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
    return <div className="text-left">Loading...</div>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Date</TableHead>
            <TableHead className="text-left">Type</TableHead>
            <TableHead className="text-left">Description</TableHead>
            <TableHead className="text-left">Category</TableHead>
            <TableHead className="text-left">Amount</TableHead>
            <TableHead className="text-left">Files</TableHead>
            <TableHead className="text-left">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="text-left">{format(new Date(transaction.date), 'MMM d, yyyy')}</TableCell>
              <TableCell className="capitalize text-left">{transaction.type}</TableCell>
              <TableCell className="text-left">{transaction.description}</TableCell>
              <TableCell className="text-left">{transaction.category}</TableCell>
              <TableCell className="text-left">
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
            refetch();
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