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

type EditAffiliateFormProps = {
  partner: {
    id: string;
    name: string;
    program: string;
    commission_rate: string | null;
    login_email: string | null;
    login_password: string | null;
    dashboard_url: string | null;
  };
  onSuccess?: () => void;
};

export function EditAffiliateForm({ partner, onSuccess }: EditAffiliateFormProps) {
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: partner.name,
      program: partner.program,
      commissionRate: partner.commission_rate || "",
      loginEmail: partner.login_email || "",
      loginPassword: partner.login_password || "",
      dashboardUrl: partner.dashboard_url || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to update a partner");
        return;
      }

      const { error } = await supabase
        .from('affiliate_partners')
        .update({
          name: values.name,
          program: values.program,
          commission_rate: values.commissionRate,
          login_email: values.loginEmail,
          login_password: values.loginPassword,
          dashboard_url: values.dashboardUrl,
        })
        .eq('id', partner.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success("Partner updated successfully");
      queryClient.invalidateQueries({ queryKey: ['affiliatePartners'] });
      onSuccess?.();
    } catch (error) {
      console.error('Error updating partner:', error);
      toast.error("Failed to update partner");
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

        <Button type="submit" className="w-full">Update Partner</Button>
      </form>
    </Form>
  );
}