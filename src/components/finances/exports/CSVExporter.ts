import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const exportToCSV = async (transactions: any[], selectedDate: Date) => {
  try {
    // Prepare CSV data
    const csvRows = [
      ['Date', 'Type', 'Amount', 'Description', 'Category', 'Notes', 'Attachments']
    ];

    for (const transaction of transactions || []) {
      const attachmentLinks = await Promise.all(
        (transaction.transaction_attachments || []).map(async (attachment) => {
          const { data } = await supabase.storage
            .from('financial_docs')
            .createSignedUrl(attachment.file_path, 60 * 60);
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
    link.download = `finances_${format(selectedDate, 'yyyy-MM')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Export completed successfully');
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
};