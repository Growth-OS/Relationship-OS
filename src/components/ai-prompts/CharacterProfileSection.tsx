import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { User } from "lucide-react";
import { useEffect } from "react";
import { usePromptForm } from "./hooks/usePromptForm";
import { usePromptQuery } from "./hooks/usePromptQuery";

interface CharacterProfileForm {
  name: string;
  background: string;
  personality: string;
  tone: string;
  expertise: string;
}

export const CharacterProfileSection = () => {
  const form = useForm<CharacterProfileForm>();
  const { handleSubmit: handlePromptSubmit } = usePromptForm();
  const { data: existingProfile } = usePromptQuery("character_profile");

  useEffect(() => {
    if (existingProfile) {
      const systemPrompt = existingProfile.system_prompt;
      const matches = {
        name: systemPrompt.match(/You are (.*?),/)?.[1] || "",
        background: systemPrompt.match(/Background: (.*?)(?=\n|$)/)?.[1] || "",
        personality: systemPrompt.match(/Personality: (.*?)(?=\n|$)/)?.[1] || "",
        tone: systemPrompt.match(/Tone of Voice: (.*?)(?=\n|$)/)?.[1] || "",
        expertise: systemPrompt.match(/Areas of Expertise: (.*?)(?=\n|$)/)?.[1] || "",
      };
      form.reset(matches);
    }
  }, [existingProfile, form]);

  const onSubmit = async (data: CharacterProfileForm) => {
    const promptData = {
      title: `Character Profile: ${data.name}`,
      system_prompt: `You are ${data.name}, with the following characteristics:
Background: ${data.background}
Personality: ${data.personality}
Tone of Voice: ${data.tone}
Areas of Expertise: ${data.expertise}

Please respond to all prompts in character, maintaining this persona consistently.`,
      category: "character_profile",
      user_id: "", // Will be set in handlePromptSubmit
    };

    await handlePromptSubmit(promptData, existingProfile?.id);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="w-5 h-5" />
          <CardTitle>Character Profile</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Character Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter character name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="background"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the character's background and history"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personality Traits</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the character's personality"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tone of Voice</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Professional, Casual, Friendly"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expertise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Areas of Expertise</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List the character's areas of expertise"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">
              {existingProfile ? 'Update' : 'Create'} Character Profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};