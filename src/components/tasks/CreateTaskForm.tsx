import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface TaskFormData {
  title: string;
  description?: string;
  due_date?: Date;
  priority: 'low' | 'medium' | 'high';
}

interface CreateTaskFormProps {
  sourceId?: string;
  source?: 'deals' | 'content' | 'ideas' | 'substack' | 'other';
  onSuccess?: (taskTitle: string) => void;
  initialData?: {
    id: string;
    title: string;
    description?: string;
    due_date?: string;
    priority: string;
  };
}

export const CreateTaskForm = ({ sourceId, source = 'other', onSuccess, initialData }: CreateTaskFormProps) => {
  const form = useForm<TaskFormData>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      due_date: initialData?.due_date ? new Date(initialData.due_date) : undefined,
      priority: (initialData?.priority || 'medium') as 'low' | 'medium' | 'high'
    }
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to create a task');
        return;
      }

      // Convert Date to ISO string for Supabase
      const formattedData = {
        ...data,
        due_date: data.due_date?.toISOString().split('T')[0], // Convert to YYYY-MM-DD
        source,
        source_id: sourceId,
        user_id: user.id,
      };

      let error;
      
      if (initialData?.id) {
        // Update existing task
        const { error: updateError } = await supabase
          .from('tasks')
          .update(formattedData)
          .eq('id', initialData.id);
        error = updateError;
      } else {
        // Create new task
        const { error: insertError } = await supabase
          .from('tasks')
          .insert(formattedData);
        error = insertError;
      }

      if (error) throw error;
      
      toast.success(initialData ? 'Task updated successfully' : 'Task created successfully');
      onSuccess?.(data.title);
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error(initialData ? 'Error updating task' : 'Error creating task');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
      </form>
    </Form>
  );
};