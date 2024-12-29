import { format, isValid, parseISO } from "date-fns";

interface InvoicePreviewProps {
  invoice: {
    invoice_number: string;
    company_name: string;
    company_address?: string;
    company_email?: string;
    client_name: string;
    client_address?: string;
    client_email?: string;
    issue_date: string;
    due_date: string;
    items: {
      description: string;
      quantity: number;
      unit_price: number;
      amount: number;
    }[];
    subtotal: number;
    tax_rate?: number;
    tax_amount?: number;
    total: number;
    notes?: string;
  };
}

export const InvoicePreview = ({ invoice }: InvoicePreviewProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        return 'Invalid date';
      }
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{invoice.company_name}</h2>
          {invoice.company_address && (
            <p className="text-gray-600">{invoice.company_address}</p>
          )}
          {invoice.company_email && (
            <p className="text-gray-600">{invoice.company_email}</p>
          )}
        </div>
        <div className="text-right">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">INVOICE</h1>
          <p className="text-gray-600">Invoice #: {invoice.invoice_number}</p>
          <p className="text-gray-600">
            Issue Date: {formatDate(invoice.issue_date)}
          </p>
          <p className="text-gray-600">
            Due Date: {formatDate(invoice.due_date)}
          </p>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8">
        <h3 className="text-gray-600 font-medium mb-2">Bill To:</h3>
        <p className="font-medium text-gray-800">{invoice.client_name}</p>
        {invoice.client_address && (
          <p className="text-gray-600">{invoice.client_address}</p>
        )}
        {invoice.client_email && (
          <p className="text-gray-600">{invoice.client_email}</p>
        )}
      </div>

      {/* Items Table */}
      <table className="w-full mb-8">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 text-gray-600">Description</th>
            <th className="text-right py-2 text-gray-600">Quantity</th>
            <th className="text-right py-2 text-gray-600">Unit Price</th>
            <th className="text-right py-2 text-gray-600">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-2 text-gray-800">{item.description}</td>
              <td className="text-right py-2 text-gray-800">{item.quantity}</td>
              <td className="text-right py-2 text-gray-800">€{item.unit_price.toFixed(2)}</td>
              <td className="text-right py-2 text-gray-800">€{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-gray-800">€{invoice.subtotal.toFixed(2)}</span>
          </div>
          {invoice.tax_rate && invoice.tax_amount && (
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Tax ({invoice.tax_rate}%):</span>
              <span className="text-gray-800">€{invoice.tax_amount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-t border-gray-200 font-medium">
            <span>Total:</span>
            <span>€{invoice.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mt-8">
          <h3 className="text-gray-600 font-medium mb-2">Notes:</h3>
          <p className="text-gray-600">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
};