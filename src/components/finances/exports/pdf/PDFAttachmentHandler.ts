import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export const handleAttachment = async (
  pdfDoc: PDFDocument,
  attachment: any,
  transaction: any
) => {
  try {
    // Download the file from Supabase storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('financial_docs')
      .download(attachment.file_path);

    if (downloadError) throw downloadError;

    const attachmentBytes = await fileData.arrayBuffer();
    const attachmentPage = pdfDoc.addPage();
    const { width, height } = attachmentPage.getSize();

    // Add attachment header
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    attachmentPage.drawText(`Attachment: ${attachment.file_name}`, {
      x: 50,
      y: height - 50,
      size: 12,
      font: boldFont,
    });

    attachmentPage.drawText(`Transaction Date: ${format(new Date(transaction.date), 'dd/MM/yyyy')}`, {
      x: 50,
      y: height - 70,
      size: 10,
      font: regularFont,
    });

    attachmentPage.drawText(`Description: ${transaction.description || 'No description'}`, {
      x: 50,
      y: height - 90,
      size: 10,
      font: regularFont,
    });

    // Handle image embedding based on file type
    if (attachment.file_type?.startsWith('image/')) {
      try {
        let image;
        if (attachment.file_type === 'image/png') {
          image = await pdfDoc.embedPng(attachmentBytes);
        } else if (attachment.file_type === 'image/jpeg' || attachment.file_type === 'image/jpg') {
          image = await pdfDoc.embedJpg(attachmentBytes);
        }

        if (image) {
          // Calculate dimensions to fit within page while maintaining aspect ratio
          const maxWidth = width - 100; // 50px margin on each side
          const maxHeight = height - 150; // Space for header and margins
          
          const imgDims = image.scale(1); // Get original dimensions
          let scaledWidth = imgDims.width;
          let scaledHeight = imgDims.height;

          // Calculate scale to fit within page bounds
          const widthScale = maxWidth / scaledWidth;
          const heightScale = maxHeight / scaledHeight;
          const scale = Math.min(widthScale, heightScale, 1); // Don't upscale images

          scaledWidth *= scale;
          scaledHeight *= scale;

          // Center the image on the page
          const xPosition = (width - scaledWidth) / 2;
          const yPosition = height - 120 - scaledHeight; // Position below the header

          attachmentPage.drawImage(image, {
            x: xPosition,
            y: yPosition,
            width: scaledWidth,
            height: scaledHeight,
          });
        }
      } catch (imageError) {
        console.error('Error embedding image:', imageError);
        attachmentPage.drawText('Error: Could not embed image', {
          x: 50,
          y: height - 120,
          size: 10,
          font: regularFont,
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