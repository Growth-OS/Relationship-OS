import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Building } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface CompanyInfoForm {
  name: string;
  description: string;
  values: string;
  tone: string;
  industry: string;
}

export const CompanyInfoSection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<CompanyInfoForm>();

  // Fetch existing company info
  const { data: existingInfo } = useQuery({
    queryKey: ["aiPrompts", "company_info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_prompts")
        .select("*")
        .eq("category", "company_info")
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  // Set form values when existing info is loaded
  useEffect(() => {
    if (existingInfo) {
      const systemPrompt = existingInfo.system_prompt;
      const matches = {
        name: systemPrompt.match(/represent (.*?),/)?.[1] || "",
        description: systemPrompt.match(/Company Description: (.*?)(?=\n|$)/)?.[1] || "",
        values: systemPrompt.match(/Company Values: (.*?)(?=\n|$)/)?.[1] || "",
        tone: systemPrompt.match(/Tone of Voice: (.*?)(?=\n|$)/)?.[1] || "",
        industry: systemPrompt.match(/Industry: (.*?)(?=\n|$)/)?.[1] || "",
      };
      form.reset(matches);
    }
  }, [existingInfo, form]);

  const onSubmit = async (data: CompanyInfoForm) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No authenticated user found");

      const promptData = {
        title: `Company Info: ${data.name}`,
        system_prompt: `You represent ${data.name}, with the following characteristics:
Company Description: ${data.description}
Company Values: ${data.values}
Tone of Voice: ${data.tone}
Industry: ${data.industry}

Please ensure all responses align with this company profile and maintain consistent branding.`,
        category: "company_info",
        user_id: user.id,
      };

      const { error } = existingInfo
        ? await supabase.from("ai_prompts").update(promptData).eq("id", existingInfo.id)
        : await supabase.from("ai_prompts").insert(promptData);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Company information ${existingInfo ? 'updated' : 'created'} successfully`,
      });

      queryClient.invalidateQueries({ queryKey: ["aiPrompts"] });
    } catch (error) {
      console.error("Error saving company info:", error);
      toast({
        title: "Error",
        description: `Failed to ${existingInfo ? 'update' : 'create'} company information`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          <CardTitle>Company Information</CardTitle>
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
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what your company does"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="values"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Values</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List your company's core values"
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
                  <FormLabel>Brand Voice</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Professional, Innovative, Friendly"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Technology, Healthcare, Education"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">
              {existingInfo ? 'Update' : 'Create'} Company Profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};