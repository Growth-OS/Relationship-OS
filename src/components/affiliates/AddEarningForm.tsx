import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  partnerId: z.string().min(1, "Please select a partner"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  notes: z.string().optional(),
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
    enabled: !partnerId, // Only fetch partners if no specific partnerId is provided
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partnerId: partnerId || "",
      amount: "",
      date: new Date().toISOString().split('T')[0],
      notes: "",
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
        notes: values.notes || null,
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
          {!partnerId && (
            <FormField
              control={form.control}
              name="partnerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partner</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a partner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {partners?.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Add any relevant notes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          Add Earnings {partnerName ? `for ${partnerName}` : ''}
        </Button>
      </form>
    </Form>
  );
}