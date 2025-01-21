import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ProjectFormFields } from "./form/ProjectFormFields";
import { ProjectDateFields } from "./form/ProjectDateFields";
import { ProjectBudgetField } from "./form/ProjectBudgetField";
import { ProjectFormData } from "./form/types";

interface CreateInvoiceFormProps {
  onSuccess?: () => void;
  onDataChange?: (data: any) => void;
}

export const CreateInvoiceForm = ({ onSuccess, onDataChange }: CreateInvoiceFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<ProjectFormData>({
    defaultValues: {
      status: 'active',
      company_name: "Prospect Labs UAB",
      company_address: "Verkiu g. 31B2\nLT09108 Vilnius\nLithuania\nCompany Number: LT100012926716",
      company_vat_code: "",
      company_code: "",
      payment_terms: "Bank: Revolut\nBank Address: 09108, Verkiu 31B2, Laisves Namai, Vilnius, Lithuania\nAccount Holder: UAB Prospect Labs\nIBAN Number: LT81 3250 0549 4897 7554\nSwift / BIC: REVOLT21\nIntermediary BIC: BARCGB22"
    },
  });

  useEffect(() => {
    const subscription = form.watch((data) => {
      if (onDataChange && data.invoice_number) {
        const calculatedData = calculateTotals(data as InvoiceFormData);
        onDataChange(calculatedData);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onDataChange]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to create a project');
        return;
      }

      const { error } = await supabase
        .from('projects')
        .insert({
          ...data,
          user_id: user.id,
          start_date: data.start_date?.toISOString().split('T')[0],
          end_date: data.end_date?.toISOString().split('T')[0],
          deal_id: data.deal_id || null,
        });

      if (error) throw error;
      
      toast.success('Project created successfully');
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['chat-history'] });
      onSuccess?.();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Error creating project');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ProjectFormFields form={form} />
        <ProjectDateFields form={form} />
        <ProjectBudgetField form={form} />
        <Button type="submit" className="w-full">
          Create Project
        </Button>
      </form>
    </Form>
  );
};