import { format, isValid, parseISO } from "date-fns";

interface InvoicePreviewProps {
  invoice: {
    invoice_number: string;
    company_name: string;
    company_address?: string;
    company_email?: string;
    company_vat_code?: string;
    company_code?: string;
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
    payment_terms?: string;
  };
}

export const InvoicePreview = ({ invoice }: InvoicePreviewProps) => {
  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white p-8 rounded-lg">
        <p className="text-gray-500">No invoice data available</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Invalid date';
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

  const formatCurrency = (amount: number | undefined | null) => {
    // Convert to number and check if it's valid
    const numAmount = amount !== undefined && amount !== null ? Number(amount) : 0;
    
    // Check if the conversion resulted in a valid number
    if (isNaN(numAmount)) {
      return '€0.00';
    }
    
    return `€${numAmount.toFixed(2)}`;
  };

  return (
    <div className="bg-white p-8 rounded-lg text-sm">
      {/* Header */}
      <div className="flex justify-between mb-8">
        <div className="w-1/2">
          <img 
            src="/lovable-uploads/9865aa08-9927-483e-8a53-680d9ab92e1d.png" 
            alt="Company Logo" 
            className="h-12 mb-6"
          />
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{invoice.client_name}</h2>
            {invoice.client_address && (
              <p className="text-gray-600 text-sm whitespace-pre-line">{invoice.client_address}</p>
            )}
            {invoice.client_email && (
              <p className="text-gray-600 text-sm">{invoice.client_email}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-right">
            <p className="text-gray-600">Invoice #: {invoice.invoice_number}</p>
            <p className="text-gray-600">Date: {formatDate(invoice.issue_date)}</p>
            <p className="text-gray-600">Due Date: {formatDate(invoice.due_date)}</p>
          </div>
          <div className="text-right mt-4">
            <h2 className="font-semibold">{invoice.company_name}</h2>
            {invoice.company_address && (
              <p className="text-gray-600 text-sm whitespace-pre-line">{invoice.company_address}</p>
            )}
            {invoice.company_email && (
              <p className="text-gray-600 text-sm">{invoice.company_email}</p>
            )}
            {invoice.company_vat_code && (
              <p className="text-gray-600 text-sm">VAT Code: {invoice.company_vat_code}</p>
            )}
            {invoice.company_code && (
              <p className="text-gray-600 text-sm">Company Code: {invoice.company_code}</p>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-6">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 text-gray-600">Description</th>
            <th className="text-right py-2 text-gray-600">Quantity</th>
            <th className="text-right py-2 text-gray-600">Unit Price</th>
            <th className="text-right py-2 text-gray-600">Amount</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(invoice.items) && invoice.items.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-2 text-gray-800">{item.description}</td>
              <td className="text-right py-2 text-gray-800">{item.quantity}</td>
              <td className="text-right py-2 text-gray-800">{formatCurrency(item.unit_price)}</td>
              <td className="text-right py-2 text-gray-800">{formatCurrency(item.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-1">
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-gray-800">{formatCurrency(invoice.subtotal)}</span>
          </div>
          {invoice.tax_rate !== undefined && invoice.tax_amount !== undefined && (
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Tax ({invoice.tax_rate}%):</span>
              <span className="text-gray-800">{formatCurrency(invoice.tax_amount)}</span>
            </div>
          )}
          <div className="flex justify-between py-1 border-t border-gray-200 font-medium">
            <span>Total:</span>
            <span>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Payment Terms */}
      {invoice.payment_terms && (
        <div className="mt-8 pt-4">
          <p className="text-gray-600 text-sm whitespace-pre-line">{invoice.payment_terms}</p>
        </div>
      )}

      {/* Notes */}
      {invoice.notes && (
        <div className="mt-6">
          <h3 className="text-gray-600 font-medium mb-1 text-sm">Notes:</h3>
          <p className="text-gray-600 text-sm">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
};