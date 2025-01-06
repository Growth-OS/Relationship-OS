import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.enum(["idea", "bug", "feature", "improvement"]),
  priority: z.enum(["low", "medium", "high"]),
  due_date: z.string().optional(),
});

interface CreateDevelopmentItemFormProps {
  onSuccess: () => void;
  itemToEdit?: {
    id: string;
    title: string;
    description: string;
    category: "idea" | "bug" | "feature" | "improvement";
    priority: "low" | "medium" | "high";
    due_date?: string;
  } | null;
}

export const CreateDevelopmentItemForm = ({ onSuccess, itemToEdit }: CreateDevelopmentItemFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: itemToEdit?.title || "",
      description: itemToEdit?.description || "",
      category: itemToEdit?.category || "idea",
      priority: itemToEdit?.priority || "medium",
      due_date: itemToEdit?.due_date || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to add items");
        return;
      }

      const itemData = {
        title: values.title,
        description: values.description,
        category: values.category,
        priority: values.priority,
        due_date: values.due_date || null,
        user_id: user.id,
      };

      let error;

      if (itemToEdit) {
        ({ error } = await supabase
          .from("development_items")
          .update(itemData)
          .eq("id", itemToEdit.id));
      } else {
        ({ error } = await supabase
          .from("development_items")
          .insert([itemData]));
      }

      if (error) throw error;

      toast.success(itemToEdit ? "Item updated successfully" : "Item added successfully");
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error("Failed to save item");
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
                <Input placeholder="Enter title" {...field} />
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
                <Textarea 
                  placeholder="Enter description (optional)"
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="idea">Idea</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="improvement">Improvement</SelectItem>
                  </SelectContent>
                </Select>
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
        </div>

        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date (Optional)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {itemToEdit ? "Update Item" : "Add Item"}
        </Button>
      </form>
    </Form>
  );
};