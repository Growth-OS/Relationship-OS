import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

type AmountInputProps = {
  form: UseFormReturn<any>;
};

export const AmountInput = ({ form }: AmountInputProps) => {
  return (
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
  );
};