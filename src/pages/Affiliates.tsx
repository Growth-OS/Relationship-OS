import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Users } from "lucide-react";
import { AffiliateForm } from "@/components/affiliates/AffiliateForm";
import { StatsCards } from "@/components/affiliates/StatsCards";
import { PartnersTable } from "@/components/affiliates/PartnersTable";
import { EarningsTable } from "@/components/affiliates/EarningsTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Affiliates = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: affiliates, isLoading: isLoadingPartners } = useQuery({
    queryKey: ['affiliatePartners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('affiliate_partners')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
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
      return data;
    }
  });

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyEarnings = earnings?.reduce((sum, earning) => {
    const earningDate = new Date(earning.date);
    if (earningDate.getMonth() === currentMonth && earningDate.getFullYear() === currentYear) {
      return sum + Number(earning.amount);
    }
    return sum;
  }, 0) ?? 0;

  // Calculate average commission rate from partners
  const avgCommission = affiliates?.reduce((sum, partner) => {
    if (partner.commission_rate) {
      const rate = parseFloat(partner.commission_rate);
      return !isNaN(rate) ? sum + rate : sum;
    }
    return sum;
  }, 0);
  const avgCommissionRate = affiliates?.length ? 
    `${(avgCommission / affiliates.length).toFixed(1)}%` : 
    "N/A";

  // Calculate YoY growth (mock data for now)
  const yearlyGrowth = 23.5; // This could be calculated from real data in the future

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary">Affiliate Partners</h1>
          </div>
          <p className="text-gray-600 mt-2">Manage your affiliate relationships and track performance</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
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

      <StatsCards 
        totalPartners={affiliates?.length ?? 0}
        monthlyEarnings={monthlyEarnings}
        avgCommission={avgCommissionRate}
        yearlyGrowth={yearlyGrowth}
      />

      <Card>
        <CardHeader>
          <CardTitle>Partner Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <PartnersTable 
            partners={affiliates ?? []}
            isLoading={isLoadingPartners}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Earnings History</CardTitle>
        </CardHeader>
        <CardContent>
          <EarningsTable 
            earnings={earnings ?? []}
            isLoading={isLoadingEarnings}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Affiliates;