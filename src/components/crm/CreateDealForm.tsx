import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DealFormFields } from "./form-fields/DealFormFields";
import { DealFormData } from "./types";

interface CreateDealFormProps {
  onSuccess: () => void;
}

export const CreateDealForm = ({ onSuccess }: CreateDealFormProps) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm<DealFormData>({
    defaultValues: {
      stage: 'lead'
    }
  });

  const onSubmit = async (data: DealFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to create a deal');
        return;
      }

      const { error } = await supabase
        .from('deals')
        .insert({
          ...data,
          deal_value: Number(data.deal_value),
          user_id: user.id,
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['deals'] });
      toast.success('Deal created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error creating deal:', error);
      toast.error('Error creating deal');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <DealFormFields register={register} setValue={setValue} />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        Create Deal
      </Button>
    </form>
  );
};