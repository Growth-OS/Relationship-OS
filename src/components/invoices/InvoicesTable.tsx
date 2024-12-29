import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  issue_date: string;
  due_date: string;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
}

interface InvoicesTableProps {
  invoices: Invoice[];
}

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

export const InvoicesTable = ({ invoices }: InvoicesTableProps) => {
  const handleDownload = async (invoiceId: string) => {
    try {
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .select(`
          *,
          invoice_items (*)
        `)
        .eq('id', invoiceId)
        .single();

      if (invoiceError) throw invoiceError;

      // Convert the invoice data to a PDF using the browser's print functionality
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Unable to open print window. Please check your popup settings.");
        return;
      }

      // Get the logo as base64
      const logoUrl = '/lovable-uploads/9865aa08-9927-483e-8a53-680d9ab92e1d.png';
      const logoResponse = await fetch(logoUrl);
      const logoBlob = await logoResponse.blob();
      const logoBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(logoBlob);
      });

      printWindow.document.write(`
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
              @media print {
                body { padding: 0; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
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

            <script>
              window.onload = () => {
                window.print();
                window.onafterprint = () => window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error("Failed to download invoice");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice #</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Issue Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.invoice_number}</TableCell>
            <TableCell>{invoice.client_name}</TableCell>
            <TableCell>{format(new Date(invoice.issue_date), 'MMM d, yyyy')}</TableCell>
            <TableCell>{format(new Date(invoice.due_date), 'MMM d, yyyy')}</TableCell>
            <TableCell>€{invoice.total.toFixed(2)}</TableCell>
            <TableCell>
              <Badge className={statusColors[invoice.status]}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(invoice.id)}
              >
                <Download className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};