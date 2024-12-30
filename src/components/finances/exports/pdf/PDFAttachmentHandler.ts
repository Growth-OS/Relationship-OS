import { PDFDocument, PDFPage, rgb } from "pdf-lib";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export const handleAttachment = async (
  pdfDoc: PDFDocument,
  attachment: any,
  transaction: any
) => {
  try {
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('financial_docs')
      .download(attachment.file_path);

    if (downloadError) throw downloadError;

    const attachmentBytes = await fileData.arrayBuffer();
    const attachmentPage = pdfDoc.addPage();
    const { width, height } = attachmentPage.getSize();

    // Add attachment header
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

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

    // Handle image embedding
    if (attachment.file_type?.startsWith('image/')) {
      let image;
      try {
        if (attachment.file_type === 'image/png') {
          image = await pdfDoc.embedPng(attachmentBytes);
        } else if (attachment.file_type === 'image/jpeg' || attachment.file_type === 'image/jpg') {
          image = await pdfDoc.embedJpg(attachmentBytes);
        }

        if (image) {
          const imgDims = image.scale(0.5);
          const maxWidth = width - 100;
          const maxHeight = height - 150;
          
          let imgWidth = imgDims.width;
          let imgHeight = imgDims.height;

          // Calculate dimensions to fit within page
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
            y: height - 120 - imgHeight,
            width: imgWidth,
            height: imgHeight,
          });
        }
      } catch (imageError) {
        console.error('Error embedding image:', imageError);
        attachmentPage.drawText('Error: Could not embed image', {
          x: 50,
          y: height - 100,
          size: 10,
          font: timesRomanFont,
          color: rgb(1, 0, 0),
        });
      }
    }

    return attachmentPage;
  } catch (error) {
    console.error('Error processing attachment:', error);
    throw error;
  }
};