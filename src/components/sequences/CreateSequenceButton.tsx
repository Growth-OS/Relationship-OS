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

interface CreateSequenceForm {
  name: string;
  description: string;
}

export const CreateSequenceButton = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<CreateSequenceForm>();

  const onSubmit = async (data: CreateSequenceForm) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to create a sequence');
        return;
      }

      const { error } = await supabase
        .from('sequences')
        .insert({
          name: data.name,
          description: data.description,
          status: 'active',
          max_steps: 5,
          user_id: user.id
        });

      if (error) throw error;

      toast.success('Sequence created successfully');
      queryClient.invalidateQueries({ queryKey: ['sequences'] });
      reset();
      setOpen(false);
    } catch (error) {
      console.error('Error creating sequence:', error);
      toast.error('Failed to create sequence');
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter sequence description"
              {...register("description")}
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