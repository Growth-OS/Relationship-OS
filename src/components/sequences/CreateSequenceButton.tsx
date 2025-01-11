import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface CreateSequenceForm {
  name: string;
  description: string;
}

export const CreateSequenceButton = () => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateSequenceForm>();

  const onSubmit = async (data: CreateSequenceForm) => {
    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to create a sequence');
        return;
      }

      const sequenceData = {
        name: data.name,
        description: data.description,
        status: 'active',
        max_steps: 5,
        user_id: user.id,
        is_deleted: false
      };

      console.log('Creating sequence with data:', sequenceData);

      const { data: sequence, error } = await supabase
        .from('sequences')
        .insert([sequenceData])
        .select()
        .single();

      if (error) {
        console.error('Error creating sequence:', error);
        toast.error('Failed to create sequence');
        return;
      }

      if (!sequence?.id) {
        console.error('No sequence ID returned after creation');
        toast.error('Error creating sequence');
        return;
      }

      console.log('Created sequence:', sequence);
      await queryClient.invalidateQueries({ queryKey: ['sequences'] });
      
      reset();
      setOpen(false);
      toast.success('Sequence created successfully');
      
      // Add a small delay to ensure state updates are processed
      setTimeout(() => {
        navigate(`/dashboard/sequences/${sequence.id}/edit`);
      }, 100);

    } catch (error) {
      console.error('Error in sequence creation:', error);
      toast.error('Failed to create sequence');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Sequence
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Sequence</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter sequence name"
              {...register("name", { required: true })}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-500">Name is required</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter sequence description"
              {...register("description")}
              disabled={isSubmitting}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Sequence"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};