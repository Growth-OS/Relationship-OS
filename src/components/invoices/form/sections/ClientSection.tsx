import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ClientSectionProps {
  form: UseFormReturn<any>;
}

export const ClientSection = ({ form }: ClientSectionProps) => {
  const { data: deals = [] } = useQuery({
    queryKey: ['deals-to-invoice'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('stage', 'to_invoice');
      
      if (error) throw error;
      return data || [];
    },
  });

  const handleDealSelect = (dealId: string) => {
    const selectedDeal = deals.find(deal => deal.id === dealId);
    if (selectedDeal) {
      form.setValue('client_name', selectedDeal.company_name);
      form.setValue('client_email', selectedDeal.contact_email || '');
      form.setValue('deal_id', selectedDeal.id);
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="deal_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Deal</FormLabel>
            <Select onValueChange={handleDealSelect} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a deal to invoice" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {deals.map((deal) => (
                  <SelectItem key={deal.id} value={deal.id}>
                    {deal.company_name} (${deal.deal_value.toLocaleString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="client_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client Name</FormLabel>
            <FormControl>
              <Input placeholder="Client Company" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="client_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client Address</FormLabel>
            <FormControl>
              <Input placeholder="456 Client Ave" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="client_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="client@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};