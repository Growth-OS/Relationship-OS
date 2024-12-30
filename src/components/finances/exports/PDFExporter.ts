import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const generatePDFReport = async (transactions: any[], selectedDate: Date) => {
  try {
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

            // Create a new page for the attachment
            const attachmentPage = pdfDoc.addPage();
            
            // Add attachment header
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

            // Embed the image if it's an image file
            if (attachment.file_type?.startsWith('image/')) {
              try {
                const image = await pdfDoc.embedPng(attachmentBytes);
                const imgDims = image.scale(0.5); // Scale down to 50%
                
                // Calculate dimensions to fit within page while maintaining aspect ratio
                const maxWidth = width - 100; // 50px margin on each side
                const maxHeight = height - 150; // Account for header text
                let imgWidth = imgDims.width;
                let imgHeight = imgDims.height;

                if (imgWidth > maxWidth) {
                  const scale = maxWidth / imgWidth;
                  imgWidth *= scale;
                  imgHeight *= scale;
                }
                if (imgHeight > maxHeight) {
                  const scale = maxHeight / imgHeight;
                  imgWidth *= scale;
                  imgHeight *= scale;
                }

                // Center the image horizontally
                const xPosition = (width - imgWidth) / 2;
                
                attachmentPage.drawImage(image, {
                  x: xPosition,
                  y: height - 120 - imgHeight, // Position below the header text
                  width: imgWidth,
                  height: imgHeight,
                });
              } catch (imageError) {
                console.error('Error embedding image:', imageError);
                attachmentPage.drawText('Error: Could not embed image', {
                  x: 50,
                  y: height - 100,
                  size: 10,
                  font: timesRomanFont,
                  color: rgb(1, 0, 0), // Red text for error
                });
              }
            }

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
};