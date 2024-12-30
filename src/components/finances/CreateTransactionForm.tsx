import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CategorySelect } from "./form-fields/CategorySelect";
import { TransactionTypeField } from "./form-fields/TransactionTypeField";
import { AmountField } from "./form-fields/AmountField";
import { DescriptionField } from "./form-fields/DescriptionField";
import { DateField } from "./form-fields/DateField";
import { NotesField } from "./form-fields/NotesField";
import { AttachmentField } from "./form-fields/AttachmentField";
import { FinancialTransaction } from "@/integrations/supabase/types/finances";
import { useQuery } from "@tanstack/react-query";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

const formSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().min(1),
  category: z.string().min(1),
  date: z.string().min(1),
  notes: z.string().optional(),
  files: z.any().optional(),
});

interface CreateTransactionFormProps {
  onSuccess: () => void;
  initialData?: FinancialTransaction;
}

export const CreateTransactionForm = ({ onSuccess, initialData }: CreateTransactionFormProps) => {
  // Fetch existing attachments if editing
  const { data: existingAttachments } = useQuery({
    queryKey: ['transaction-attachments', initialData?.id],
    queryFn: async () => {
      if (!initialData?.id) return [];
      const { data, error } = await supabase
        .from('transaction_attachments')
        .select('*')
        .eq('transaction_id', initialData.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!initialData?.id,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: initialData?.type || 'expense',
      amount: initialData?.amount ? Number(initialData.amount) : undefined,
      description: initialData?.description || '',
      category: initialData?.category || '',
      date: initialData?.date || new Date().toISOString().split('T')[0],
      notes: initialData?.notes || '',
      files: undefined, // Reset files field when editing
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to add transactions');
        return;
      }

      if (initialData) {
        // Update existing transaction
        const { error: transactionError } = await supabase
          .from('financial_transactions')
          .update({
            type: values.type,
            amount: values.amount,
            description: values.description,
            category: values.category,
            date: values.date,
            notes: values.notes,
          })
          .eq('id', initialData.id);

        if (transactionError) throw transactionError;

        // Handle file upload for edited transactions
        const files = (form.getValues('files') as FileList)?.[0];
        if (files) {
          const fileExt = files.name.split('.').pop();
          const filePath = `${user.id}/${initialData.id}/${crypto.randomUUID()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('financial_docs')
            .upload(filePath, files);

          if (uploadError) throw uploadError;

          const { error: attachmentError } = await supabase
            .from('transaction_attachments')
            .insert({
              transaction_id: initialData.id,
              file_path: filePath,
              file_name: files.name,
              file_type: files.type,
            });

          if (attachmentError) throw attachmentError;
        }
      } else {
        // Insert new transaction
        const { data: transaction, error: transactionError } = await supabase
          .from('financial_transactions')
          .insert({
            user_id: user.id,
            type: values.type,
            amount: values.amount,
            description: values.description,
            category: values.category,
            date: values.date,
            notes: values.notes,
          })
          .select()
          .single();

        if (transactionError) throw transactionError;

        // Handle file uploads for new transactions
        const files = (form.getValues('files') as FileList)?.[0];
        if (files && transaction) {
          const fileExt = files.name.split('.').pop();
          const filePath = `${user.id}/${transaction.id}/${crypto.randomUUID()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('financial_docs')
            .upload(filePath, files);

          if (uploadError) throw uploadError;

          const { error: attachmentError } = await supabase
            .from('transaction_attachments')
            .insert({
              transaction_id: transaction.id,
              file_path: filePath,
              file_name: files.name,
              file_type: files.type,
            });

          if (attachmentError) throw attachmentError;
        }
      }

      toast.success(initialData ? 'Transaction updated successfully' : 'Transaction added successfully');
      onSuccess();
      form.reset();
    } catch (error) {
      console.error('Error with transaction:', error);
      toast.error(initialData ? 'Error updating transaction' : 'Error adding transaction');
    }
  };

  return (
    <div className="space-y-6 py-2 px-1">
      <DialogHeader>
        <DialogTitle>
          {initialData ? 'Edit Transaction' : 'Add Transaction'}
        </DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <TransactionTypeField form={form} />
          <AmountField form={form} />
          <DescriptionField form={form} />
          <CategorySelect form={form} transactionType={form.watch('type')} />
          <DateField form={form} />
          <NotesField form={form} />
          <AttachmentField form={form} existingAttachments={existingAttachments} />
          <Button type="submit" className="w-full">
            {initialData ? 'Update Transaction' : 'Add Transaction'}
          </Button>
        </form>
      </Form>
    </div>
  );
};