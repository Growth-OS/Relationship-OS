import { format } from 'date-fns';

export const companyInfoTemplate = (invoice: any) => `
  <div class="company-info">
    <p>${invoice.company_name}</p>
    ${invoice.company_address ? `<p>${invoice.company_address}</p>` : ''}
    ${invoice.company_email ? `<p>${invoice.company_email}</p>` : ''}
  </div>
`;

export const clientInfoTemplate = (invoice: any) => `
  <div class="client-info">
    <h3>Bill To</h3>
    <p><strong>${invoice.client_name}</strong></p>
    ${invoice.client_address ? `<p>${invoice.client_address}</p>` : ''}
    ${invoice.client_email ? `<p>${invoice.client_email}</p>` : ''}
  </div>
`;

export const invoiceItemsTemplate = (invoice: any) => `
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
`;

export const totalsTemplate = (invoice: any) => `
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
`;

export const generateInvoiceHeader = (invoice: any, logoBase64: string) => `
  <div class="header">
    <div>
      <div class="invoice-info">
        <p><strong>Invoice #:</strong> ${invoice.invoice_number}</p>
        <p><strong>Date:</strong> ${format(new Date(invoice.issue_date), 'MMM d, yyyy')}</p>
        <p><strong>Due Date:</strong> ${format(new Date(invoice.due_date), 'MMM d, yyyy')}</p>
      </div>
      ${companyInfoTemplate(invoice)}
    </div>
    <div>
      <img src="${logoBase64}" alt="Company Logo" class="logo" />
    </div>
  </div>
`;