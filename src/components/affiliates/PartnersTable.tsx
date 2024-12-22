import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, DollarSign } from "lucide-react";
import { EditAffiliateForm } from "./EditAffiliateForm";
import { AddEarningForm } from "./AddEarningForm";
import { useState } from "react";

type Partner = {
  id: string;
  name: string;
  program: string;
  commission_rate: string | null;
  login_email: string | null;
  dashboard_url: string | null;
};

type PartnersTableProps = {
  partners: Partner[];
  isLoading: boolean;
};

export const PartnersTable = ({ partners, isLoading }: PartnersTableProps) => {
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [addingEarningsForPartner, setAddingEarningsForPartner] = useState<Partner | null>(null);

  if (isLoading) {
    return <div className="text-center py-4">Loading partners...</div>;
  }

  if (!partners?.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        No partners added yet. Click the "Add Partner" button to get started.
      </div>
    );
  }

  return (
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
        {partners.map((partner) => (
          <TableRow key={partner.id} className="hover:bg-gray-50">
            <TableCell className="font-medium">{partner.name}</TableCell>
            <TableCell>{partner.program}</TableCell>
            <TableCell>{partner.commission_rate}</TableCell>
            <TableCell>{partner.login_email}</TableCell>
            <TableCell>
              {partner.dashboard_url && (
                <a 
                  href={partner.dashboard_url} 
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
                <Dialog open={editingPartner?.id === partner.id} onOpenChange={(open) => !open && setEditingPartner(null)}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setEditingPartner(partner)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Edit Partner</DialogTitle>
                    </DialogHeader>
                    <EditAffiliateForm 
                      partner={partner} 
                      onSuccess={() => setEditingPartner(null)} 
                    />
                  </DialogContent>
                </Dialog>
                <Dialog 
                  open={addingEarningsForPartner?.id === partner.id} 
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
                      <DialogTitle>Add Earnings for {partner.name}</DialogTitle>
                    </DialogHeader>
                    <AddEarningForm 
                      partnerId={partner.id}
                      partnerName={partner.name}
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
  );
};