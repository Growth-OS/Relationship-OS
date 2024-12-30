import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ProjectFormData } from "./types";

interface DealSelectProps {
  form: UseFormReturn<ProjectFormData>;
  onDealSelect: (dealId: string) => void;
}

export const DealSelect = ({ form, onDealSelect }: DealSelectProps) => {
  const { data: deals = [] } = useQuery({
    queryKey: ['deals', 'in_progress'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('stage', 'in_progress');
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <FormField
      control={form.control}
      name="deal_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Select Deal</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              const selectedDeal = deals.find(deal => deal.id === value);
              if (selectedDeal) {
                form.setValue('name', selectedDeal.company_name);
                form.setValue('client_name', selectedDeal.company_name);
                onDealSelect(value);
              }
            }}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select a deal" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {deals.map((deal) => (
                <SelectItem key={deal.id} value={deal.id}>
                  {deal.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};