import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { CreateInvoiceDialog } from "@/components/invoices/CreateInvoiceDialog";
import { InvoicesTable } from "@/components/invoices/InvoicesTable";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const Invoices = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select(`
            *,
            invoice_items (*)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching invoices:', error);
          toast.error("Failed to fetch invoices");
          throw error;
        }

        return data || [];
      } catch (err) {
        console.error('Error in query:', err);
        toast.error("Failed to fetch invoices");
        throw err;
      }
    },
    retry: 2,
    retryDelay: 1000,
  });

  if (error) {
    toast.error("Error loading invoices. Please try again.");
  }

  const filteredInvoices = invoices?.filter(invoice => 
    invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const paidAmount = filteredInvoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.total, 0);
  const overdueAmount = filteredInvoices
    .filter(invoice => invoice.status === 'overdue')
    .reduce((sum, invoice) => sum + invoice.total, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
            <p className="text-muted-foreground">
              Create and manage your invoices
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Outstanding</div>
            <div className="text-2xl font-bold mt-2">€{(totalAmount - paidAmount).toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Total Paid</div>
            <div className="text-2xl font-bold mt-2 text-green-600">€{paidAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">Overdue Amount</div>
            <div className="text-2xl font-bold mt-2 text-red-600">€{overdueAmount.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search invoices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-center p-8 text-red-600">
          Failed to load invoices. Please try refreshing the page.
        </div>
      ) : (
        <InvoicesTable invoices={filteredInvoices} />
      )}

      <CreateInvoiceDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};

export default Invoices;