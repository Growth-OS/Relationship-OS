import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface CompanyFieldsProps {
  form: UseFormReturn<any>;
}

export const CompanyFields = ({ form }: CompanyFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="company_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="company_website"
        render={({ field }) => {
          console.log('Website field value:', field.value);
          return (
            <FormItem>
              <FormLabel>Company Website</FormLabel>
              <FormControl>
                <Input 
                  type="url" 
                  placeholder="https://example.com" 
                  {...field} 
                  onChange={(e) => {
                    console.log('Website input changed:', e.target.value);
                    field.onChange(e);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </>
  );
};