import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, ExternalLink, Copy } from "lucide-react";
import { EditAffiliateForm } from "./EditAffiliateForm";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type Partner = {
  id: string;
  name: string;
  program: string;
  commission_rate: string | null;
  login_email: string | null;
  login_password: string | null;
  dashboard_url: string | null;
};

type PartnersTableProps = {
  partners: Partner[];
  isLoading: boolean;
};

export const PartnersTable = ({ partners, isLoading }: PartnersTableProps) => {
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Loading partners...</div>;
  }

  if (!partners?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No partners added yet. Click the "Add Partner" button to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Partner</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>Login Details</TableHead>
            <TableHead>Dashboard</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => (
            <TableRow key={partner.id} className="group hover:bg-gray-50">
              <TableCell className="font-medium">{partner.name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{partner.program}</Badge>
              </TableCell>
              <TableCell>{partner.commission_rate || "N/A"}</TableCell>
              <TableCell>
                {partner.login_email && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm truncate max-w-[200px]">{partner.login_email}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(partner.login_email!)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {partner.dashboard_url && (
                  <a 
                    href={partner.dashboard_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    Open Dashboard
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Dialog open={editingPartner?.id === partner.id} onOpenChange={(open) => !open && setEditingPartner(null)}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setEditingPartner(partner)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};