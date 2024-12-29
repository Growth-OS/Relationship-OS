import { format } from "date-fns";
import { pdfStyles } from "./pdf/styles";
import { 
  generateInvoiceHeader,
  clientInfoTemplate, 
  invoiceItemsTemplate, 
  totalsTemplate 
} from "./pdf/templates";

interface InvoicePDFGeneratorProps {
  invoice: any;
  logoBase64: string;
}

export const generateInvoicePDF = ({ invoice, logoBase64 }: InvoicePDFGeneratorProps) => {
  return `
    <html>
      <head>
        <title>Invoice ${invoice.invoice_number}</title>
        <style>${pdfStyles}</style>
      </head>
      <body>
        <div class="invoice-title">Invoice</div>
        ${generateInvoiceHeader(invoice, logoBase64)}
        ${clientInfoTemplate(invoice)}
        ${invoiceItemsTemplate(invoice)}
        ${totalsTemplate(invoice)}

        ${invoice.notes ? `
          <div class="notes">
            <h3>Notes</h3>
            <p>${invoice.notes}</p>
          </div>
        ` : ''}

        ${invoice.payment_terms ? `
          <div class="notes">
            <h3>Payment Terms</h3>
            <p>${invoice.payment_terms}</p>
          </div>
        ` : ''}
      </body>
    </html>
  `;
};