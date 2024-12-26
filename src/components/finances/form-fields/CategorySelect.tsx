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

const categories = {
  income: [
    'Consulting',
    'Affiliate Revenue',
    'Content Creation',
    'Speaking',
    'Coaching',
    'Product Sales',
    'Other Income'
  ],
  expense: [
    'Software & Tools',
    'Marketing',
    'Office Supplies',
    'Travel',
    'Professional Services',
    'Education',
    'Subscriptions',
    'Hardware',
    'Other Expenses'
  ]
};

type CategorySelectProps = {
  form: UseFormReturn<any>;
  transactionType: 'income' | 'expense';
};

export const CategorySelect = ({ form, transactionType }: CategorySelectProps) => {
  const availableCategories = categories[transactionType];

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {availableCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
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