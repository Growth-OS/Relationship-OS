import { PDFDocument, StandardFonts } from "pdf-lib";
import { format } from "date-fns";
import { handleAttachment } from "./PDFAttachmentHandler";

export const createTransactionsPage = async (
  pdfDoc: PDFDocument,
  transactions: any[]
) => {
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  
  const transactionsPage = pdfDoc.addPage();
  const { width, height } = transactionsPage.getSize();
  
  transactionsPage.drawText('Transactions', {
    x: 50,
    y: height - 50,
    size: 18,
    font: boldFont,
  });

  let yPosition = height - 80;
  const lineHeight = 20;

  for (const transaction of transactions) {
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

    if (transaction.transaction_attachments?.length > 0) {
      for (const attachment of transaction.transaction_attachments) {
        await handleAttachment(pdfDoc, attachment, transaction);
        
        transactionsPage.drawText(`   • ${attachment.file_name}`, {
          x: 70,
          y: yPosition,
          size: 10,
          font: timesRomanFont,
        });

        yPosition -= lineHeight;
      }
    }

    yPosition -= lineHeight;
  }

  return transactionsPage;
};