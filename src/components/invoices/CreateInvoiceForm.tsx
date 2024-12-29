import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { InvoiceFormFields } from "./form/InvoiceFormFields";
import { InvoiceItemsField } from "./form/InvoiceItemsField";

interface CreateInvoiceFormProps {
  onSuccess?: () => void;
}

export const CreateInvoiceForm = ({ onSuccess }: CreateInvoiceFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      items: [{ description: "", quantity: 1, unit_price: 0 }],
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to create an invoice');
        return;
      }

      // Calculate totals
      const items = data.items.map((item: any) => ({
        ...item,
        amount: item.quantity * item.unit_price,
      }));

      const subtotal = items.reduce((sum: number, item: any) => sum + item.amount, 0);
      const taxAmount = subtotal * (data.tax_rate || 0) / 100;
      const total = subtotal + taxAmount;

      // Create invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          ...data,
          user_id: user.id,
          subtotal,
          tax_amount: taxAmount,
          total,
          status: 'draft',
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Create invoice items
      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(
          items.map((item: any) => ({
            invoice_id: invoice.id,
            ...item,
          }))
        );

      if (itemsError) throw itemsError;
      
      toast.success('Invoice created successfully');
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      onSuccess?.();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Error creating invoice');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <InvoiceFormFields form={form} />
        <InvoiceItemsField form={form} />
        <Button type="submit" className="w-full">
          Create Invoice
        </Button>
      </form>
    </Form>
  );
};