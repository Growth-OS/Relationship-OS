import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, DollarSign, Users, Percent, TrendingUp } from "lucide-react";
import { AffiliateForm } from "@/components/affiliates/AffiliateForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const Affiliates = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: affiliates, isLoading } = useQuery({
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

  const stats = [
    {
      title: "Total Partners",
      value: affiliates?.length ?? "0",
      trend: "Active partners",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Active Campaigns",
      value: "8",
      trend: "5 pending review",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "Monthly Earnings",
      value: "$3,800",
      trend: "+15% vs last month",
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            <AffiliateForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          {isLoading ? (
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {affiliates?.map((affiliate) => (
                  <TableRow key={affiliate.id} className="cursor-pointer hover:bg-gray-50">
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