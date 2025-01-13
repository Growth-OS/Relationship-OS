import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { generateInvoicePDF } from "./InvoicePDFGenerator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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
  draft: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  sent: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  paid: "bg-green-100 text-green-800 hover:bg-green-200",
  overdue: "bg-red-100 text-red-800 hover:bg-red-200",
  cancelled: "bg-gray-100 text-gray-800 hover:bg-gray-200",
};

const statusLabels = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
  overdue: "Overdue",
  cancelled: "Cancelled",
};

export const InvoicesTable = ({ invoices }: InvoicesTableProps) => {
  const queryClient = useQueryClient();
  const [sortField, setSortField] = useState<keyof Invoice>('issue_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const updateInvoiceStatus = async (invoiceId: string, newStatus: Invoice['status']) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status: newStatus })
        .eq('id', invoiceId);

      if (error) throw error;

      toast.success(`Invoice status updated to ${statusLabels[newStatus]}`);
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast.error("Failed to update invoice status");
    }
  };

  const deleteInvoice = async (invoiceId: string) => {
    try {
      // First delete related invoice items
      const { error: itemsError } = await supabase
        .from('invoice_items')
        .delete()
        .eq('invoice_id', invoiceId);

      if (itemsError) throw itemsError;

      // Then delete the invoice
      const { error: invoiceError } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId);

      if (invoiceError) throw invoiceError;

      toast.success("Invoice deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error("Failed to delete invoice");
    }
  };

  const handleSort = (field: keyof Invoice) => {
    setSortDirection(current => 
      sortField === field 
        ? current === 'asc' 
          ? 'desc' 
          : 'asc'
        : 'asc'
    );
    setSortField(field);
  };

  const sortedInvoices = [...invoices].sort((a, b) => {
    if (sortField === 'total') {
      return sortDirection === 'asc' 
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    }
    return sortDirection === 'asc'
      ? String(a[sortField]).localeCompare(String(b[sortField]))
      : String(b[sortField]).localeCompare(String(a[sortField]));
  });

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

  const SortIcon = ({ field }: { field: keyof Invoice }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 inline-block ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline-block ml-1" />
    );
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead 
              className="cursor-pointer hover:bg-muted/70"
              onClick={() => handleSort('invoice_number')}
            >
              Invoice # <SortIcon field="invoice_number" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/70"
              onClick={() => handleSort('client_name')}
            >
              Client <SortIcon field="client_name" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/70"
              onClick={() => handleSort('issue_date')}
            >
              Issue Date <SortIcon field="issue_date" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/70"
              onClick={() => handleSort('due_date')}
            >
              Due Date <SortIcon field="due_date" />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/70 text-right"
              onClick={() => handleSort('total')}
            >
              Amount <SortIcon field="total" />
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedInvoices.map((invoice) => (
            <TableRow key={invoice.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
              <TableCell>{invoice.client_name}</TableCell>
              <TableCell>{format(new Date(invoice.issue_date), 'MMM d, yyyy')}</TableCell>
              <TableCell>{format(new Date(invoice.due_date), 'MMM d, yyyy')}</TableCell>
              <TableCell className="text-right font-medium">€{invoice.total.toFixed(2)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-auto p-0">
                      <Badge className={statusColors[invoice.status]}>
                        {statusLabels[invoice.status]}
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {Object.entries(statusLabels).map(([status, label]) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => updateInvoiceStatus(invoice.id, status as Invoice['status'])}
                      >
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(invoice.id)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete invoice #{invoice.invoice_number}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteInvoice(invoice.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};