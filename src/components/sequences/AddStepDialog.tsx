import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { StepType } from "./types";

interface StepFormValues {
  step_type: StepType;
  message_template: string;
  delay_days: number;
  preferred_time?: string;
}

interface AddStepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: StepFormValues) => void;
}

export const AddStepDialog = ({ open, onOpenChange, onSubmit }: AddStepDialogProps) => {
  const form = useForm<StepFormValues>({
    defaultValues: {
      step_type: "email_1",
      message_template: "",
      delay_days: 1,
    },
  });

  const handleSubmit = (values: StepFormValues) => {
    onSubmit(values);
    form.reset();
    toast.success("Step added successfully - a task will be created when this step is due");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Sequence Step</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="step_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Step Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select step type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="email_1">Email 1</SelectItem>
                      <SelectItem value="email_2">Email 2</SelectItem>
                      <SelectItem value="linkedin_connection">LinkedIn Connection Request</SelectItem>
                      <SelectItem value="linkedin_message_1">LinkedIn Message 1</SelectItem>
                      <SelectItem value="linkedin_message_2">LinkedIn Message 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message_template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Template</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your message template..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="delay_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delay (days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferred_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Time (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Add Step</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};