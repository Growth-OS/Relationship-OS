import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Ban } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface WordsToAvoidForm {
  words: string;
  reason: string;
}

export const WordsToAvoidSection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<WordsToAvoidForm>();

  const onSubmit = async (data: WordsToAvoidForm) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No authenticated user found");

      const { error } = await supabase.from("ai_prompts").insert({
        title: "Words to Avoid List",
        system_prompt: `Please avoid using the following words and phrases in your responses:

Words/Phrases to Avoid:
${data.words}

Reason for Avoidance:
${data.reason}

Please ensure all responses exclude these words and phrases, finding appropriate alternatives when needed.`,
        category: "words_to_avoid",
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Words to avoid list created successfully",
      });

      form.reset();
      queryClient.invalidateQueries({ queryKey: ["aiPrompts"] });
    } catch (error) {
      console.error("Error creating words to avoid list:", error);
      toast({
        title: "Error",
        description: "Failed to create words to avoid list",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Ban className="w-5 h-5" />
          <CardTitle>Words to Avoid</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="words"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Words and Phrases to Avoid</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter words or phrases to avoid (one per line)"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Avoiding</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Explain why these words should be avoided"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Create Words to Avoid List</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};