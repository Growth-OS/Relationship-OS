import { useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  title: string;
  publishDate: Date;
  status: string;
}

interface SubstackFormProps {
  onSuccess?: () => void;
}

export const SubstackForm = ({ onSuccess }: SubstackFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<FormData>({
    defaultValues: {
      title: "",
      publishDate: new Date(),
      status: "draft"
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Auth error:", userError);
        throw userError;
      }

      if (!user) {
        console.error("No authenticated user found");
        throw new Error("No authenticated user found");
      }

      console.log("Attempting to insert post with data:", {
        title: data.title,
        publish_date: format(data.publishDate, "yyyy-MM-dd"),
        user_id: user.id,
        status: data.status
      });

      const { error: insertError } = await supabase.from("substack_posts").insert({
        title: data.title,
        publish_date: format(data.publishDate, "yyyy-MM-dd"),
        user_id: user.id,
        status: data.status
      });

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }

      toast({
        title: "Success",
        description: "Post added successfully",
      });

      form.reset();
      queryClient.invalidateQueries({ queryKey: ["substackPosts"] });
      onSuccess?.();
    } catch (error) {
      console.error("Error adding post:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add post",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
                <Input placeholder="Enter post title" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="idea">Idea</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="editing">Editing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="publishDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Publish Date</FormLabel>
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
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Post"}
        </Button>
      </form>
    </Form>
  );
};