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
}

interface CreateInvoiceFormProps {
  onSuccess?: () => void;
  onDataChange?: (data: InvoiceFormData) => void;
}

const calculateTotals = (data: InvoiceFormData): InvoiceFormData => {
  const subtotal = data.subtotal || 0;
  const taxRate = data.tax_rate || 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  return {
    ...data,
    tax_amount: taxAmount,
    total: total
  };
};

export const CreateInvoiceForm = ({ onSuccess, onDataChange }: CreateInvoiceFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<InvoiceFormData>({
    defaultValues: {
      company_name: "Prospect Labs UAB",
      company_address: "Verkiu g. 31B2\nLT09108 Vilnius\nLithuania\nCompany Number: LT100012926716",
      company_vat_code: "",
      company_code: "",
      payment_terms: "Bank: Revolut\nBank Address: 09108, Verkiu 31B2, Laisves Namai, Vilnius, Lithuania\nAccount Holder: UAB Prospect Labs\nIBAN Number: LT81 3250 0549 4897 7554\nSwift / BIC: REVOLT21\nIntermediary BIC: BARCGB22"
    },
  });

  useEffect(() => {
    const generateInvoiceNumber = async () => {
      const currentYear = new Date().getFullYear().toString().slice(-2);
      
      // Get the latest invoice number for the current year
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

  useEffect(() => {
    const subscription = form.watch((data) => {
      if (onDataChange && data.invoice_number) {
        const calculatedData = calculateTotals(data as InvoiceFormData);
        onDataChange(calculatedData);
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

      const { error } = await supabase
        .from('invoices')
        .insert({
          ...data,
          user_id: user.id,
        });

      if (error) throw error;
      
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <InvoiceFormFields form={form} />
        <Button type="submit" className="w-full">
          Create Invoice
        </Button>
      </form>
    </Form>
  );
};