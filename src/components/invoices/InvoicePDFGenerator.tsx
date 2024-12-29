import { format } from "date-fns";

interface InvoicePDFGeneratorProps {
  invoice: any;
  logoBase64: string;
}

export const generateInvoicePDF = ({ invoice, logoBase64 }: InvoicePDFGeneratorProps) => {
  return `
    <html>
      <head>
        <title>Invoice ${invoice.invoice_number}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .logo { height: 48px; margin-bottom: 24px; }
          .company-info { margin-bottom: 20px; }
          .client-info { margin-bottom: 40px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          .totals { margin-left: auto; width: 300px; }
          .totals table { margin-top: 20px; }
          .invoice-title { 
            font-size: 48px; 
            font-weight: bold; 
            margin-bottom: 30px;
            font-family: 'Arial', sans-serif;
            letter-spacing: -1px;
          }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-title">Invoice</div>
        <div class="header">
          <div>
            <img src="${logoBase64}" alt="Company Logo" class="logo" />
            <div class="company-info">
              <h2>${invoice.company_name}</h2>
              ${invoice.company_address ? `<p>${invoice.company_address}</p>` : ''}
              ${invoice.company_email ? `<p>${invoice.company_email}</p>` : ''}
            </div>
          </div>
          <div>
            <p>Invoice #: ${invoice.invoice_number}</p>
            <p>Date: ${format(new Date(invoice.issue_date), 'MMM d, yyyy')}</p>
            <p>Due Date: ${format(new Date(invoice.due_date), 'MMM d, yyyy')}</p>
          </div>
        </div>

        <div class="client-info">
          <h3>Bill To:</h3>
          <p>${invoice.client_name}</p>
          ${invoice.client_address ? `<p>${invoice.client_address}</p>` : ''}
          ${invoice.client_email ? `<p>${invoice.client_email}</p>` : ''}
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.invoice_items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>€${item.unit_price.toFixed(2)}</td>
                <td>€${item.amount.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <table>
            <tr>
              <td>Subtotal:</td>
              <td>€${invoice.subtotal.toFixed(2)}</td>
            </tr>
            ${invoice.tax_rate ? `
              <tr>
                <td>Tax (${invoice.tax_rate}%):</td>
                <td>€${invoice.tax_amount.toFixed(2)}</td>
              </tr>
            ` : ''}
            <tr>
              <td><strong>Total:</strong></td>
              <td><strong>€${invoice.total.toFixed(2)}</strong></td>
            </tr>
          </table>
        </div>

        ${invoice.notes ? `
          <div class="notes">
            <h3>Notes:</h3>
            <p>${invoice.notes}</p>
          </div>
        ` : ''}

        ${invoice.payment_terms ? `
          <div class="payment-terms">
            <h3>Payment Terms:</h3>
            <p>${invoice.payment_terms}</p>
          </div>
        ` : ''}
      </body>
    </html>
  `;
};