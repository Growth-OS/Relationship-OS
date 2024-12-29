import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { InvoiceFormFields } from "./form/InvoiceFormFields";
import { InvoiceItemsField } from "./form/InvoiceItemsField";
import { useEffect } from "react";

interface InvoiceFormData {
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
    amount?: number;
  }[];
  tax_rate?: number;
}

interface CreateInvoiceFormProps {
  onSuccess?: () => void;
  onDataChange?: (data: any) => void;
}

export const CreateInvoiceForm = ({ onSuccess, onDataChange }: CreateInvoiceFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<InvoiceFormData>({
    defaultValues: {
      invoice_number: "",
      company_name: "",
      client_name: "",
      items: [{ description: "", quantity: 1, unit_price: 0 }],
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
  });

  const calculateTotals = (data: InvoiceFormData) => {
    const items = data.items.map((item) => ({
      ...item,
      amount: item.quantity * item.unit_price,
    }));

    const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
    const taxAmount = subtotal * (data.tax_rate || 0) / 100;
    const total = subtotal + taxAmount;

    return {
      ...data,
      items,
      subtotal,
      tax_amount: taxAmount,
      total,
    };
  };

  // Update preview data whenever form values change
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (onDataChange && data.invoice_number) {
        onDataChange(calculateTotals(data as InvoiceFormData));
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onDataChange]);

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to create an invoice');
        return;
      }

      const calculatedData = calculateTotals(data);

      // Create invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          ...calculatedData,
          user_id: user.id,
          status: 'draft',
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Create invoice items
      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(
          calculatedData.items.map((item) => ({
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