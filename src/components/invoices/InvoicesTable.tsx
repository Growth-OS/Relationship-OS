import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { generateInvoicePDF } from "./InvoicePDFGenerator";

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

      // Get the logo as base64
      const logoUrl = '/lovable-uploads/9865aa08-9927-483e-8a53-680d9ab92e1d.png';
      const logoResponse = await fetch(logoUrl);
      const logoBlob = await logoResponse.blob();
      const logoBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(logoBlob);
      });

      // Generate the PDF content
      const pdfContent = generateInvoicePDF({ 
        invoice, 
        logoBase64: logoBase64 as string 
      });

      // Open a new window and write the content
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error("Unable to open print window. Please check your popup settings.");
        return;
      }

      // Write the content and ensure it's loaded before printing
      printWindow.document.write(pdfContent);
      printWindow.document.close();

      // Wait for content to load before printing
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          // Close window after print dialog is closed
          printWindow.onafterprint = () => printWindow.close();
        }, 500); // Small delay to ensure styles are applied
      };

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
        {invoices?.map((invoice) => (
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