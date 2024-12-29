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
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #334155;
            line-height: 1.5;
            padding: 40px;
            max-width: 1000px;
            margin: 0 auto;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 60px;
            padding-bottom: 30px;
            border-bottom: 1px solid #e2e8f0;
          }
          .logo {
            height: 40px;
            margin-bottom: 20px;
          }
          .company-info {
            margin-bottom: 20px;
            font-size: 14px;
          }
          .company-info h2 {
            color: #0f172a;
            margin: 0 0 8px 0;
            font-size: 18px;
          }
          .company-info p {
            margin: 4px 0;
            color: #64748b;
          }
          .invoice-info {
            text-align: right;
            font-size: 14px;
          }
          .invoice-info p {
            margin: 4px 0;
            color: #64748b;
          }
          .invoice-title {
            font-size: 42px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 40px;
            letter-spacing: -1px;
          }
          .client-info {
            margin-bottom: 40px;
            font-size: 14px;
          }
          .client-info h3 {
            color: #64748b;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin: 0 0 12px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 40px 0;
            font-size: 14px;
          }
          th {
            text-align: left;
            padding: 12px 0;
            border-bottom: 2px solid #e2e8f0;
            color: #64748b;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          td {
            padding: 16px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .amount-cell {
            text-align: right;
            font-family: 'SF Mono', 'Monaco', monospace;
          }
          .totals {
            margin-left: auto;
            width: 300px;
            font-size: 14px;
          }
          .totals table {
            margin: 0;
          }
          .totals table td {
            padding: 8px 0;
          }
          .totals table tr:last-child td {
            border-top: 2px solid #e2e8f0;
            border-bottom: none;
            padding-top: 16px;
            font-weight: 600;
            color: #0f172a;
          }
          .notes {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 14px;
            color: #64748b;
          }
          .notes h3, .payment-terms h3 {
            color: #0f172a;
            font-size: 14px;
            margin: 0 0 8px 0;
          }
          @media print {
            body { padding: 20px; }
            .invoice-title { margin-bottom: 30px; }
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
          <div class="invoice-info">
            <p><strong>Invoice #:</strong> ${invoice.invoice_number}</p>
            <p><strong>Date:</strong> ${format(new Date(invoice.issue_date), 'MMM d, yyyy')}</p>
            <p><strong>Due Date:</strong> ${format(new Date(invoice.due_date), 'MMM d, yyyy')}</p>
          </div>
        </div>

        <div class="client-info">
          <h3>Bill To</h3>
          <p><strong>${invoice.client_name}</strong></p>
          ${invoice.client_address ? `<p>${invoice.client_address}</p>` : ''}
          ${invoice.client_email ? `<p>${invoice.client_email}</p>` : ''}
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th style="text-align: right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.invoice_items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>€${item.unit_price.toFixed(2)}</td>
                <td class="amount-cell">€${item.amount.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <table>
            <tr>
              <td>Subtotal</td>
              <td class="amount-cell">€${invoice.subtotal.toFixed(2)}</td>
            </tr>
            ${invoice.tax_rate ? `
              <tr>
                <td>Tax (${invoice.tax_rate}%)</td>
                <td class="amount-cell">€${invoice.tax_amount.toFixed(2)}</td>
              </tr>
            ` : ''}
            <tr>
              <td>Total</td>
              <td class="amount-cell">€${invoice.total.toFixed(2)}</td>
            </tr>
          </table>
        </div>

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