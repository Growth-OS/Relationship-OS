import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  program: z.string().min(2, "Program name is required"),
  commissionRate: z.string(),
  loginEmail: z.string().email("Invalid login email"),
  loginPassword: z.string().min(8, "Password must be at least 8 characters"),
  dashboardUrl: z.string().url("Invalid URL format"),
});

export function AffiliateForm({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      program: "",
      commissionRate: "",
      loginEmail: "",
      loginPassword: "",
      dashboardUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase.from('affiliate_partners').insert({
        name: values.name,
        program: values.program,
        commission_rate: values.commissionRate,
        login_email: values.loginEmail,
        login_password: values.loginPassword,
        dashboard_url: values.dashboardUrl,
      });

      if (error) throw error;

      toast.success("Partner added successfully");
      queryClient.invalidateQueries({ queryKey: ['affiliatePartners'] });
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error adding partner:', error);
      toast.error("Failed to add partner");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Partner Name</FormLabel>
                <FormControl>
                  <Input placeholder="Partner name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="program"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Name</FormLabel>
                <FormControl>
                  <Input placeholder="Program name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="commissionRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commission Rate</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 30%" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loginEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Login Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="login@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="loginPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Login Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dashboardUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dashboard URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://dashboard.example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">Add Partner</Button>
      </form>
    </Form>
  );
}