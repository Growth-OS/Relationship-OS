import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateDealFormProps {
  onSuccess: () => void;
}

const stages = [
  { id: 'lead', label: 'Lead' },
  { id: 'contact_made', label: 'Contact Made' },
  { id: 'proposal_sent', label: 'Proposal Sent' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'closed_won', label: 'Closed Won' },
  { id: 'closed_lost', label: 'Closed Lost' },
];

export const CreateDealForm = ({ onSuccess }: CreateDealFormProps) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from('deals')
        .insert([{
          ...data,
          deal_value: Number(data.deal_value),
        }]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast.success('Deal created successfully');
      reset(); // Reset form fields
      onSuccess(); // Close the dialog
    } catch (error) {
      console.error('Error creating deal:', error);
      toast.error('Error creating deal');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="company_name">Company Name</Label>
        <Input id="company_name" {...register('company_name', { required: true })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stage">Stage</Label>
        <Select defaultValue="lead" onValueChange={(value) => register('stage').onChange({ target: { value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Select stage" />
          </SelectTrigger>
          <SelectContent>
            {stages.map((stage) => (
              <SelectItem key={stage.id} value={stage.id}>
                {stage.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" {...register('stage', { value: 'lead' })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="deal_value">Deal Value</Label>
        <Input
          id="deal_value"
          type="number"
          {...register('deal_value', { required: true, min: 0 })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="delivery_start_date">Delivery Start Date</Label>
        <Input
          id="delivery_start_date"
          type="date"
          {...register('delivery_start_date')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="delivery_end_date">Delivery End Date</Label>
        <Input
          id="delivery_end_date"
          type="date"
          {...register('delivery_end_date')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_email">Contact Email</Label>
        <Input
          id="contact_email"
          type="email"
          {...register('contact_email')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_linkedin">Contact LinkedIn</Label>
        <Input
          id="contact_linkedin"
          {...register('contact_linkedin')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_job_title">Contact Job Title</Label>
        <Input
          id="contact_job_title"
          {...register('contact_job_title')}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        Create Deal
      </Button>
    </form>
  );
};