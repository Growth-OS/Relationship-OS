import { PDFDocument, PDFPage, StandardFonts } from "pdf-lib";
import { format } from "date-fns";

export const createCoverPage = async (
  pdfDoc: PDFDocument,
  selectedDate: Date,
  transactions: any[]
) => {
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  
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

  return coverPage;
};