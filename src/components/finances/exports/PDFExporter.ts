import { PDFDocument } from "pdf-lib";
import { format } from "date-fns";
import { toast } from "sonner";
import { createCoverPage } from "./pdf/PDFCoverPage";
import { createTransactionsPage } from "./pdf/PDFTransactionsPage";

export class PDFExporter {
  static async export(transactions: any[], selectedDate: Date) {
    try {
      if (!transactions || transactions.length === 0) {
        toast.error(`No transactions found for ${format(selectedDate, 'MMMM yyyy')}`);
        return;
      }

      // Create PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Add cover page
      await createCoverPage(pdfDoc, selectedDate, transactions);
      
      // Add transactions page with attachments
      await createTransactionsPage(pdfDoc, transactions);

      // Save and download the PDF
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
      console.error('Error generating PDF:', error);
      throw error;
    }
  }
}