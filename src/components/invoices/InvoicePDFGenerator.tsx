import { format } from "date-fns";
import { pdfStyles } from "./pdf/styles";
import { 
  companyInfoTemplate, 
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
        <div class="header">
          <div>
            <img src="${logoBase64}" alt="Company Logo" class="logo" />
            ${companyInfoTemplate(invoice)}
          </div>
          <div class="invoice-info">
            <p><strong>Invoice #:</strong> ${invoice.invoice_number}</p>
            <p><strong>Date:</strong> ${format(new Date(invoice.issue_date), 'MMM d, yyyy')}</p>
            <p><strong>Due Date:</strong> ${format(new Date(invoice.due_date), 'MMM d, yyyy')}</p>
          </div>
        </div>

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