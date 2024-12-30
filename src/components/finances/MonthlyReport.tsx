import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const MonthlyReport = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const generateReport = async () => {
    try {
      setIsGenerating(true);
      
      // Get selected month's date range
      const startDate = startOfMonth(selectedDate);
      const endDate = endOfMonth(selectedDate);

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
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: true });

      if (error) throw error;

      if (!transactions || transactions.length === 0) {
        toast.error(`No transactions found for ${format(selectedDate, 'MMMM yyyy')}`);
        return;
      }

      // Create PDF document
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

      // Add cover page
      const coverPage = pdfDoc.addPage();
      const { width, height } = coverPage.getSize();
      
      coverPage.drawText('Monthly Financial Report', {
        x: 50,
        y: height - 100,
        size: 24,
        font: boldFont,
      });

      coverPage.drawText(format(selectedDate, 'MMMM yyyy'), {
        x: 50,
        y: height - 140,
        size: 18,
        font: timesRomanFont,
      });

      // Calculate totals
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const netIncome = totalIncome - totalExpenses;

      // Add summary
      coverPage.drawText(`Total Income: €${totalIncome.toFixed(2)}`, {
        x: 50,
        y: height - 200,
        size: 12,
        font: timesRomanFont,
      });

      coverPage.drawText(`Total Expenses: €${totalExpenses.toFixed(2)}`, {
        x: 50,
        y: height - 220,
        size: 12,
        font: timesRomanFont,
      });

      coverPage.drawText(`Net Income: €${netIncome.toFixed(2)}`, {
        x: 50,
        y: height - 240,
        size: 12,
        font: timesRomanFont,
      });

      // Add transactions page
      const transactionsPage = pdfDoc.addPage();
      
      transactionsPage.drawText('Transactions', {
        x: 50,
        y: height - 50,
        size: 18,
        font: boldFont,
      });

      let yPosition = height - 80;
      const lineHeight = 20;

      // Add transactions with attachments
      for (const transaction of transactions) {
        // Add new page if needed
        if (yPosition < 50) {
          const newPage = pdfDoc.addPage();
          yPosition = height - 50;
        }

        const transactionText = `${format(new Date(transaction.date), 'yyyy-MM-dd')} - ${
          transaction.type
        } - €${Number(transaction.amount).toFixed(2)} - ${transaction.description || 'No description'}`;

        transactionsPage.drawText(transactionText, {
          x: 50,
          y: yPosition,
          size: 10,
          font: timesRomanFont,
        });

        yPosition -= lineHeight;

        // List and embed attachments if any
        if (transaction.transaction_attachments && transaction.transaction_attachments.length > 0) {
          for (const attachment of transaction.transaction_attachments) {
            try {
              // Download attachment
              const { data: fileData, error: downloadError } = await supabase.storage
                .from('financial_docs')
                .download(attachment.file_path);

              if (downloadError) throw downloadError;

              // Convert attachment to bytes
              const attachmentBytes = await fileData.arrayBuffer();

              // Embed attachment in PDF
              const attachmentPage = pdfDoc.addPage();
              attachmentPage.drawText(`Attachment: ${attachment.file_name}`, {
                x: 50,
                y: height - 50,
                size: 12,
                font: boldFont,
              });

              attachmentPage.drawText(`For transaction: ${format(new Date(transaction.date), 'yyyy-MM-dd')} - ${transaction.description || 'No description'}`, {
                x: 50,
                y: height - 70,
                size: 10,
                font: timesRomanFont,
              });

              // List attachment in transaction page
              transactionsPage.drawText(`   • ${attachment.file_name}`, {
                x: 70,
                y: yPosition,
                size: 10,
                font: timesRomanFont,
              });

              yPosition -= lineHeight;
            } catch (error) {
              console.error('Error processing attachment:', error);
              // Continue with next attachment if one fails
            }
          }
        }

        yPosition -= lineHeight;
      }

      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `financial_report_${format(selectedDate, 'yyyy-MM')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Monthly report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate monthly report');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsGenerating(true);
      
      // Get selected month's date range
      const startDate = startOfMonth(selectedDate);
      const endDate = endOfMonth(selectedDate);

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
        .gte('date', startDate.toISOString())
        .lte('date', endDate.toISOString())
        .order('date', { ascending: true });

      if (error) throw error;

      // Prepare CSV data
      const csvRows = [
        ['Date', 'Type', 'Amount', 'Description', 'Category', 'Notes', 'Attachments']
      ];

      for (const transaction of transactions || []) {
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
      link.download = `finances_${format(selectedDate, 'yyyy-MM')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Export completed successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export transactions');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            {format(selectedDate, 'MMMM yyyy')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={isGenerating}>
            <FileText className="h-4 w-4 mr-2" />
            {isGenerating ? 'Processing...' : 'Export'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={generateReport}>
            <FileText className="h-4 w-4 mr-2" />
            Generate PDF Report
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export as CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
