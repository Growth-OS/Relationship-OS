import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { AffiliateForm } from "@/components/affiliates/AffiliateForm";
import { PartnersTable } from "@/components/affiliates/PartnersTable";
import { StatsCards } from "@/components/affiliates/StatsCards";
import { AddEarningForm } from "@/components/affiliates/AddEarningForm";
import { EarningsTable } from "@/components/affiliates/EarningsTable";
import { useState } from "react";

type Partner = {
  id: string;
  name: string;
  program: string;
  commission_rate: string | null;
  login_email: string | null;
  login_password: string | null;
  dashboard_url: string | null;
  user_id: string;
  created_at: string;
};

type Earning = {
  id: string;
  date: string;
  amount: number;
  notes: string | null;
  partner_id: string;
  user_id: string;
  created_at: string;
  affiliate_partners: {
    name: string;
  };
};

const Affiliates = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddEarningOpen, setIsAddEarningOpen] = useState(false);

  const { data: partners, isLoading: isLoadingPartners } = useQuery({
    queryKey: ['affiliatePartners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('affiliate_partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Partner[];
    },
  });

  const { data: earnings, isLoading: isLoadingEarnings } = useQuery({
    queryKey: ['affiliateEarnings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('affiliate_earnings')
        .select(`
          *,
          affiliate_partners (
            name
          )
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Earning[];
    },
  });

  const monthlyEarnings = earnings?.reduce((sum, earning) => sum + earning.amount, 0) ?? 0;
  const avgCommission = partners?.reduce((acc, partner) => {
    if (partner.commission_rate) {
      const rate = parseFloat(partner.commission_rate);
      return isNaN(rate) ? acc : acc + rate;
    }
    return acc;
  }, 0) ?? 0;
  const avgCommissionRate = partners?.length ? `${(avgCommission / partners.length).toFixed(1)}%` : "0%";

  if (isLoadingPartners || isLoadingEarnings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Affiliate Partners
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your affiliate relationships and track performance
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Partner</DialogTitle>
              </DialogHeader>
              <AffiliateForm onSuccess={() => setIsAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      <Card className="p-6">
        <StatsCards 
          totalPartners={partners?.length ?? 0}
          monthlyEarnings={monthlyEarnings}
          avgCommission={avgCommissionRate}
        />
      </Card>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-left">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Partners
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                View and manage your affiliate partnerships
              </p>
            </div>
          </div>
          <PartnersTable partners={partners ?? []} isLoading={isLoadingPartners} />
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-left">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Earnings
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Track and record affiliate earnings
              </p>
            </div>
            <Dialog open={isAddEarningOpen} onOpenChange={setIsAddEarningOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Earning
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Earning</DialogTitle>
                </DialogHeader>
                <AddEarningForm onSuccess={() => setIsAddEarningOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
          <EarningsTable earnings={earnings ?? []} isLoading={isLoadingEarnings} />
        </div>
      </Card>
    </div>
  );
};

export default Affiliates;