import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";

export const ExportTransactions = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Get current month's transactions
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(0);
      endOfMonth.setHours(23, 59, 59, 999);

      // Fetch transactions with attachments
      const { data: transactions, error } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          transaction_attachments (
            id,
            file_name,
            file_path
          )
        `)
        .gte('date', startOfMonth.toISOString())
        .lte('date', endOfMonth.toISOString())
        .order('date', { ascending: true });

      if (error) throw error;

      // Prepare CSV data
      const csvRows = [
        ['Date', 'Type', 'Amount', 'Description', 'Category', 'Notes', 'Attachments']
      ];

      for (const transaction of transactions) {
        const attachmentLinks = await Promise.all(
          (transaction.transaction_attachments || []).map(async (attachment) => {
            const { data } = await supabase.storage
              .from('financial_docs')
              .createSignedUrl(attachment.file_path, 60 * 60); // 1 hour expiry
            return `${attachment.file_name}: ${data?.signedUrl}`;
          })
        );

        csvRows.push([
          format(new Date(transaction.date), 'yyyy-MM-dd'),
          transaction.type,
          transaction.amount.toString(),
          transaction.description || '',
          transaction.category || '',
          transaction.notes || '',
          attachmentLinks.join('\n')
        ]);
      }

      // Convert to CSV
      const csvContent = csvRows
        .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
        .join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `finances_${format(startOfMonth, 'yyyy-MM')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Export completed successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export transactions');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleExport} 
      disabled={isExporting}
    >
      <Download className="h-4 w-4 mr-2" />
      {isExporting ? 'Exporting...' : 'Export Month'}
    </Button>
  );
};