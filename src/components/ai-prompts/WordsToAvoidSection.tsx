import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Ban } from "lucide-react";
import { useEffect } from "react";
import { usePromptForm } from "./hooks/usePromptForm";
import { usePromptQuery } from "./hooks/usePromptQuery";

interface WordsToAvoidForm {
  words: string;
  reason: string;
}

export const WordsToAvoidSection = () => {
  const form = useForm<WordsToAvoidForm>();
  const { handleSubmit: handlePromptSubmit } = usePromptForm();
  const { data: existingWords } = usePromptQuery("words_to_avoid");

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
    const promptData = {
      title: "Words to Avoid List",
      system_prompt: `Please avoid using the following words and phrases in your responses:

Words/Phrases to Avoid:
${data.words}

Reason for Avoidance:
${data.reason}

Please ensure all responses exclude these words and phrases, finding appropriate alternatives when needed.`,
      category: "words_to_avoid",
      user_id: "", // Will be set in handlePromptSubmit
    };

    await handlePromptSubmit(promptData, existingWords?.id);
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