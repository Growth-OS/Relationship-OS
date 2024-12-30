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

const formSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.string().min(1).transform(Number),
  description: z.string().min(1),
  category: z.string().min(1),
  date: z.string().min(1),
  notes: z.string().optional(),
  files: z.any().optional(),
});

interface CreateTransactionFormProps {
  onSuccess: () => void;
}

export const CreateTransactionForm = ({ onSuccess }: CreateTransactionFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to add transactions');
        return;
      }

      // Insert transaction
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

      // Handle file uploads
      const files = (form.getValues('files') as FileList)?.[0];
      if (files && transaction) {
        const fileExt = files.name.split('.').pop();
        const filePath = `${user.id}/${transaction.id}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('financial_docs')
          .upload(filePath, files);

        if (uploadError) throw uploadError;

        // Save file metadata
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

      toast.success('Transaction added successfully');
      onSuccess();
      form.reset();
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Error adding transaction');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TransactionTypeField form={form} />
        <AmountField form={form} />
        <DescriptionField form={form} />
        <CategorySelect form={form} transactionType={form.watch('type')} />
        <DateField form={form} />
        <NotesField form={form} />
        <AttachmentField form={form} />
        <Button type="submit" className="w-full">Add Transaction</Button>
      </form>
    </Form>
  );
};