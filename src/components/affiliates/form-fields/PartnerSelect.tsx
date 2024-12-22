import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

type Partner = {
  id: string;
  name: string;
};

type PartnerSelectProps = {
  form: UseFormReturn<any>;
  partners: Partner[];
};

export const PartnerSelect = ({ form, partners }: PartnerSelectProps) => {
  return (
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
  );
};