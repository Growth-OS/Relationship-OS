import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PartnerSelect } from "./form-fields/PartnerSelect";
import { AmountInput } from "./form-fields/AmountInput";
import { DateInput } from "./form-fields/DateInput";

const formSchema = z.object({
  partnerId: z.string().min(1, "Please select a partner"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
});

type AddEarningFormProps = {
  partnerId?: string;
  partnerName?: string;
  onSuccess?: () => void;
};

export function AddEarningForm({ partnerId, partnerName, onSuccess }: AddEarningFormProps) {
  const queryClient = useQueryClient();

  const { data: partners } = useQuery({
    queryKey: ['affiliatePartners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('affiliate_partners')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: !partnerId,
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partnerId: partnerId || "",
      amount: "",
      date: new Date().toISOString().split('T')[0],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to add earnings");
        return;
      }

      const { error } = await supabase.from('affiliate_earnings').insert({
        partner_id: values.partnerId,
        amount: Number(values.amount),
        date: values.date,
        user_id: user.id
      });

      if (error) throw error;

      toast.success("Earnings added successfully");
      queryClient.invalidateQueries({ queryKey: ['affiliateEarnings'] });
      queryClient.invalidateQueries({ queryKey: ['affiliatePartners'] });
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error adding earnings:', error);
      toast.error("Failed to add earnings");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {!partnerId && <PartnerSelect form={form} partners={partners || []} />}
          <AmountInput form={form} />
          <DateInput form={form} />
        </div>

        <Button type="submit" className="w-full">
          Add Earnings {partnerName ? `for ${partnerName}` : ''}
        </Button>
      </form>
    </Form>
  );
}