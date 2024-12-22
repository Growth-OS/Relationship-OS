import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, DollarSign, Users, Percent, Pencil } from "lucide-react";
import { AffiliateForm } from "@/components/affiliates/AffiliateForm";
import { EditAffiliateForm } from "@/components/affiliates/EditAffiliateForm";
import { AddEarningForm } from "@/components/affiliates/AddEarningForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Affiliates = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any>(null);
  const [addingEarningsForPartner, setAddingEarningsForPartner] = useState<any>(null);

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

  const stats = [
    {
      title: "Total Partners",
      value: affiliates?.length ?? "0",
      trend: "Active partners",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Monthly Earnings",
      value: `$${monthlyEarnings.toFixed(2)}`,
      trend: "Current month",
      icon: DollarSign,
      color: "text-purple-500",
    },
    {
      title: "Avg. Commission",
      value: "27.5%",
      trend: "Industry avg: 25%",
      icon: Percent,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Affiliate Partners</h1>
          <p className="text-gray-600">Manage your affiliate relationships and track performance</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary hover:bg-secondary/90">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-sm text-gray-600 mt-1">{stat.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partner Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingPartners ? (
            <div className="text-center py-4">Loading partners...</div>
          ) : affiliates?.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No partners added yet. Click the "Add Partner" button to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Login Email</TableHead>
                  <TableHead>Dashboard</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliates?.map((affiliate) => (
                  <TableRow key={affiliate.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{affiliate.name}</TableCell>
                    <TableCell>{affiliate.program}</TableCell>
                    <TableCell>{affiliate.commission_rate}</TableCell>
                    <TableCell>{affiliate.login_email}</TableCell>
                    <TableCell>
                      {affiliate.dashboard_url && (
                        <a 
                          href={affiliate.dashboard_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Open Dashboard
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog open={editingPartner?.id === affiliate.id} onOpenChange={(open) => !open && setEditingPartner(null)}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => setEditingPartner(affiliate)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Edit Partner</DialogTitle>
                            </DialogHeader>
                            <EditAffiliateForm 
                              partner={affiliate} 
                              onSuccess={() => setEditingPartner(null)} 
                            />
                          </DialogContent>
                        </Dialog>
                        <Dialog 
                          open={addingEarningsForPartner?.id === affiliate.id} 
                          onOpenChange={(open) => !open && setAddingEarningsForPartner(null)}
                        >
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                            >
                              <DollarSign className="h-4 w-4 mr-1" />
                              Add Earnings
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Add Earnings for {affiliate.name}</DialogTitle>
                            </DialogHeader>
                            <AddEarningForm 
                              partnerId={affiliate.id}
                              partnerName={affiliate.name}
                              onSuccess={() => setAddingEarningsForPartner(null)}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingEarnings ? (
            <div className="text-center py-4">Loading earnings...</div>
          ) : earnings?.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No earnings recorded yet. Click "Add Earnings" on a partner to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earnings?.map((earning) => (
                  <TableRow key={earning.id}>
                    <TableCell>{new Date(earning.date).toLocaleDateString()}</TableCell>
                    <TableCell>{earning.affiliate_partners?.name}</TableCell>
                    <TableCell>${Number(earning.amount).toFixed(2)}</TableCell>
                    <TableCell>{earning.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Affiliates;