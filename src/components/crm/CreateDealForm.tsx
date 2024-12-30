import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DealFormFields } from "./form-fields/DealFormFields";
import { DealFormData } from "./types";
import { Form } from "@/components/ui/form";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CreateDealFormProps {
  onSuccess: () => void;
  initialData?: DealFormData & { id: string };
}

export const CreateDealForm = ({ onSuccess, initialData }: CreateDealFormProps) => {
  const queryClient = useQueryClient();
  const form = useForm<DealFormData>({
    defaultValues: initialData || {
      stage: 'lead'
    }
  });

  const { handleSubmit, setValue, register, formState: { isSubmitting } } = form;

  const onSubmit = async (data: DealFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to create a deal');
        return;
      }

      if (initialData?.id) {
        const { error } = await supabase
          .from('deals')
          .update({
            ...data,
            deal_value: Number(data.deal_value),
            last_activity_date: new Date().toISOString()
          })
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success('Deal updated successfully');
      } else {
        const { error } = await supabase
          .from('deals')
          .insert({
            ...data,
            deal_value: Number(data.deal_value),
            user_id: user.id,
          });

        if (error) throw error;
        toast.success('Deal created successfully');
      }

      queryClient.invalidateQueries({ queryKey: ['deals'] });
      onSuccess();
    } catch (error) {
      console.error('Error saving deal:', error);
      toast.error('Error saving deal');
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent event bubbling
    e.stopPropagation(); // Stop event propagation
    try {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', initialData?.id);

      if (error) throw error;
      
      toast.success('Deal deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      onSuccess(); // This will close the dialog
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast.error('Error deleting deal');
    }
  };

  return (
    <Form {...form}>
      <div className="flex justify-between items-center mb-4">
        {initialData && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Deal</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this deal? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 max-w-md mx-auto py-2">
        <DealFormFields register={register} setValue={setValue} form={form} />
        <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
          {initialData ? 'Update Deal' : 'Create Deal'}
        </Button>
      </form>
    </Form>
  );
};