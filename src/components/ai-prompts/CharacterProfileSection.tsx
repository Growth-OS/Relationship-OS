import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface CharacterProfileForm {
  name: string;
  background: string;
  personality: string;
  tone: string;
  expertise: string;
}

export const CharacterProfileSection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<CharacterProfileForm>();

  const onSubmit = async (data: CharacterProfileForm) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No authenticated user found");

      const { error } = await supabase.from("ai_prompts").insert({
        title: `Character Profile: ${data.name}`,
        system_prompt: `You are ${data.name}, with the following characteristics:
Background: ${data.background}
Personality: ${data.personality}
Tone of Voice: ${data.tone}
Areas of Expertise: ${data.expertise}

Please respond to all prompts in character, maintaining this persona consistently.`,
        category: "character_profile",
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Character profile created successfully",
      });

      form.reset();
      queryClient.invalidateQueries({ queryKey: ["aiPrompts"] });
    } catch (error) {
      console.error("Error creating character profile:", error);
      toast({
        title: "Error",
        description: "Failed to create character profile",
        variant: "destructive",
      });
    }
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
            <Button type="submit">Create Character Profile</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};