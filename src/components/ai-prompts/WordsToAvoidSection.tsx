import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Ban } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface WordsToAvoidForm {
  words: string;
  reason: string;
}

export const WordsToAvoidSection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<WordsToAvoidForm>();

  // Fetch existing words to avoid
  const { data: existingWords } = useQuery({
    queryKey: ["aiPrompts", "words_to_avoid"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_prompts")
        .select("*")
        .eq("category", "words_to_avoid")
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  // Set form values when existing words are loaded
  useEffect(() => {
    if (existingWords) {
      const systemPrompt = existingWords.system_prompt;
      const wordsMatch = systemPrompt.match(/Words\/Phrases to Avoid:\n([\s\S]*?)\n\nReason/);
      const reasonMatch = systemPrompt.match(/Reason for Avoidance:\n([\s\S]*?)\n\nPlease/);
      
      form.reset({
        words: wordsMatch?.[1]?.trim() || "",
        reason: reasonMatch?.[1]?.trim() || "",
      });
    }
  }, [existingWords, form]);

  const onSubmit = async (data: WordsToAvoidForm) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No authenticated user found");

      const promptData = {
        title: "Words to Avoid List",
        system_prompt: `Please avoid using the following words and phrases in your responses:

Words/Phrases to Avoid:
${data.words}

Reason for Avoidance:
${data.reason}

Please ensure all responses exclude these words and phrases, finding appropriate alternatives when needed.`,
        category: "words_to_avoid",
        user_id: user.id,
      };

      const { error } = existingWords
        ? await supabase.from("ai_prompts").update(promptData).eq("id", existingWords.id)
        : await supabase.from("ai_prompts").insert(promptData);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Words to avoid list ${existingWords ? 'updated' : 'created'} successfully`,
      });

      queryClient.invalidateQueries({ queryKey: ["aiPrompts"] });
    } catch (error) {
      console.error("Error saving words to avoid list:", error);
      toast({
        title: "Error",
        description: `Failed to ${existingWords ? 'update' : 'create'} words to avoid list`,
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
            <Button type="submit">
              {existingWords ? 'Update' : 'Create'} Words to Avoid List
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};