import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { StageSelect } from "@/components/crm/form-fields/StageSelect";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import type { Prospect } from "../types/prospect";

const formSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  deal_value: z.string().min(1, "Deal value is required"),
  stage: z.enum(['lead', 'meeting', 'negotiation', 'project_preparation', 'in_progress', 'to_invoice', 'invoiced', 'paid', 'lost']),
  notes: z.string().optional(),
});

interface ConvertToDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prospects: Prospect[];
  onSuccess: () => void;
}

export const ConvertToDealDialog = ({
  open,
  onOpenChange,
  prospects,
  onSuccess,
}: ConvertToDealDialogProps) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: prospects[0]?.company_name || "",
      stage: "lead",
      notes: prospects[0]?.notes || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to create a deal');
        return;
      }

      // Create the deal
      const { error: dealError } = await supabase
        .from('deals')
        .insert({
          user_id: user.id,
          company_name: values.company_name,
          deal_value: Number(values.deal_value),
          stage: values.stage,
          notes: values.notes,
          contact_email: prospects[0]?.contact_email,
          contact_linkedin: prospects[0]?.contact_linkedin,
          contact_job_title: prospects[0]?.contact_job_title,
          company_website: prospects[0]?.company_website,
          source: prospects[0]?.source,
        });

      if (dealError) throw dealError;

      // Update prospects status
      const { error: prospectsError } = await supabase
        .from('prospects')
        .update({ 
          status: 'converted',
          is_converted_to_deal: true 
        })
        .in('id', prospects.map(p => p.id));

      if (prospectsError) throw prospectsError;

      await queryClient.invalidateQueries({ queryKey: ['prospects'] });
      await queryClient.invalidateQueries({ queryKey: ['deals'] });
      
      toast.success(prospects.length > 1 
        ? 'Prospects successfully converted to deal'
        : 'Prospect successfully converted to deal'
      );
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error converting to deal:', error);
      toast.error('Failed to convert to deal');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Convert to Deal</DialogTitle>
          <DialogDescription>
            {prospects.length > 1 
              ? `Convert ${prospects.length} prospects to a new deal`
              : 'Convert this prospect to a new deal'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="deal_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deal Value</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stage</FormLabel>
                  <FormControl>
                    <StageSelect 
                      value={field.value} 
                      onValueChange={field.onChange}
                    />
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
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Deal
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};