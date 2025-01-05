import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CountrySelect } from "./form-fields/CountrySelect";

interface CreateTravelFormProps {
  onSuccess: () => void;
}

export const CreateTravelForm = ({ onSuccess }: CreateTravelFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      departure_date: "",
      return_date: "",
      origin_country: "",
      origin_country_flag: "",
      destination_country: "",
      destination_country_flag: "",
      company_name: "",
      notes: "",
    },
  });

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      // Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session) throw new Error("No authenticated user");

      // Add the user_id to the values
      const travelData = {
        ...values,
        user_id: session.user.id,
      };

      const { error } = await supabase.from("travels").insert([travelData]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Travel added successfully",
      });
      
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error adding travel:", error);
      toast({
        title: "Error",
        description: "Failed to add travel",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="departure_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departure Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="return_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Return Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CountrySelect
              label="From"
              countryFieldName="origin_country"
              flagFieldName="origin_country_flag"
              form={form}
            />

            <CountrySelect
              label="To"
              countryFieldName="destination_country"
              flagFieldName="destination_country_flag"
              form={form}
            />

            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            Add Travel
          </Button>
        </form>
      </Form>
    </Card>
  );
};