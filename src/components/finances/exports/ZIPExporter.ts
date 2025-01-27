import { PDFDocument, StandardFonts } from "pdf-lib";
import { format } from "date-fns";
import JSZip from "jszip";
import { supabase } from "@/integrations/supabase/client";

export default class ZIPExporter {
  static async export(transactions: any[], selectedDate: Date) {
    try {
      // Create ZIP file
      const zip = new JSZip();
      
      // Create PDF without images
      const pdfDoc = await PDFDocument.create();
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
      
      // Add transactions to PDF
      const page = pdfDoc.addPage();
      const { height } = page.getSize();
      let yPosition = height - 50;
      
      // Add title
      page.drawText(`Financial Report - ${format(selectedDate, 'MMMM yyyy')}`, {
        x: 50,
        y: yPosition,
        size: 16,
        font: boldFont,
      });
      
      yPosition -= 40;

      // Add transactions
      for (const transaction of transactions) {
        const text = `${format(new Date(transaction.date), 'dd/MM/yyyy')} - ${
          transaction.type
        } - €${transaction.amount} - ${transaction.description || 'No description'}`;
        
        page.drawText(text, {
          x: 50,
          y: yPosition,
          size: 10,
          font: timesRomanFont,
        });
        
        yPosition -= 20;

        // If there are attachments, add reference to them
        if (transaction.transaction_attachments?.length > 0) {
          for (const attachment of transaction.transaction_attachments) {
            page.drawText(`   • Image: ${attachment.file_name}`, {
              x: 70,
              y: yPosition,
              size: 10,
              font: timesRomanFont,
            });
            yPosition -= 15;
          }
        }
        
        yPosition -= 10;
      }

      // Add PDF to ZIP
      const pdfBytes = await pdfDoc.save();
      zip.file("financial_report.pdf", pdfBytes);

      // Create images folder in ZIP
      const imagesFolder = zip.folder("images");
      
      // Download and add images to ZIP
      for (const transaction of transactions) {
        if (transaction.transaction_attachments?.length > 0) {
          for (const attachment of transaction.transaction_attachments) {
            const { data, error } = await supabase.storage
              .from('financial_docs')
              .download(attachment.file_path);
              
            if (error) {
              console.error('Error downloading file:', error);
              continue;
            }

            imagesFolder?.file(attachment.file_name, data);
          }
        }
      }

      // Generate ZIP file
      const zipContent = await zip.generateAsync({ type: "blob" });
      
      // Download ZIP
      const url = URL.createObjectURL(zipContent);
      const link = document.createElement('a');
      link.href = url;
      link.download = `financial_report_${format(selectedDate, 'yyyy-MM')}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error generating ZIP report:', error);
      throw error;
    }
  }
}