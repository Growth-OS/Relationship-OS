import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2, RefreshCw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LeadActionsProps } from "../../types/lead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const LeadActions = ({
  lead,
  onEdit,
  onDelete,
}: LeadActionsProps) => {
  const analyzeCompany = async () => {
    if (!lead.company_website) {
      toast.error("No website URL available for analysis");
      return;
    }

    try {
      toast.info("Starting company analysis...");
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to analyze companies");
        return;
      }

      const response = await fetch('/functions/v1/analyze-company', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId: lead.id,
          websiteUrl: lead.company_website,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze company');
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success("Company analysis completed successfully");
      } else {
        toast.error("Failed to analyze company");
      }
    } catch (error) {
      console.error('Error analyzing company:', error);
      toast.error("Failed to analyze company");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => onEdit()}
          className="cursor-pointer"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(lead.id)}
          className="cursor-pointer text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
        {lead.company_website && (
          <DropdownMenuItem
            onClick={analyzeCompany}
            className="cursor-pointer"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Analyze Company
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};