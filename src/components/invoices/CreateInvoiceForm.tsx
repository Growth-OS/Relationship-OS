import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { InvoiceFormFields } from "./form/InvoiceFormFields";

interface InvoiceFormData {
  company_name: string;
  company_address?: string;
  company_email?: string;
  company_vat_code?: string;
  company_code?: string;
  client_name: string;
  client_address?: string;
  client_email?: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate?: number;
  tax_amount?: number;
  total: number;
  notes?: string;
  payment_terms?: string;
  deal_id?: string;
  items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
  }>;
}

export interface CreateInvoiceFormProps {
  onSuccess?: () => void;
  onDataChange?: (data: InvoiceFormData) => void;
}

export const CreateInvoiceForm = ({ onSuccess, onDataChange }: CreateInvoiceFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<InvoiceFormData>();

  useEffect(() => {
    const generateInvoiceNumber = async () => {
      const currentYear = new Date().getFullYear().toString().slice(-2);
      
      const { data: latestInvoice, error } = await supabase
        .from('invoices')
        .select('invoice_number')
        .ilike('invoice_number', `${currentYear}-%`)
        .order('invoice_number', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching latest invoice number:', error);
        return;
      }

      let nextNumber = 1;
      if (latestInvoice) {
        const lastNumber = parseInt(latestInvoice.invoice_number.split('-')[1]);
        nextNumber = lastNumber + 1;
      }

      const newInvoiceNumber = `${currentYear}-${nextNumber.toString().padStart(3, '0')}`;
      form.setValue('invoice_number', newInvoiceNumber);
    };

    generateInvoiceNumber();
  }, [form]);

  // Watch form values for preview
  useEffect(() => {
    const subscription = form.watch((value) => {
      onDataChange?.(value as InvoiceFormData);
    });
    return () => subscription.unsubscribe();
  }, [form, onDataChange]);

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to create an invoice');
        return;
      }

      // First create the invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          user_id: user.id,
          invoice_number: data.invoice_number,
          company_name: data.company_name,
          company_address: data.company_address,
          company_email: data.company_email,
          company_vat_code: data.company_vat_code,
          company_code: data.company_code,
          client_name: data.client_name,
          client_address: data.client_address,
          client_email: data.client_email,
          issue_date: data.issue_date,
          due_date: data.due_date,
          subtotal: data.subtotal,
          tax_rate: data.tax_rate || 0,
          tax_amount: data.tax_amount || 0,
          total: data.total,
          notes: data.notes,
          payment_terms: data.payment_terms,
          deal_id: data.deal_id,
          status: 'draft'
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Then create the invoice items
      if (data.items && data.items.length > 0) {
        const { error: itemsError } = await supabase
          .from('invoice_items')
          .insert(
            data.items.map(item => ({
              invoice_id: invoice.id,
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unit_price,
              amount: item.quantity * item.unit_price
            }))
          );

        if (itemsError) throw itemsError;
      }
      
      toast.success('Invoice created successfully');
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InvoiceFormFields form={form} />
        <Button type="submit" className="w-full">
          Create Invoice
        </Button>
      </form>
    </Form>
  );
};