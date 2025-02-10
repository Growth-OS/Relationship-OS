import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BulkAnalyzeButtonProps {
  selectedIds: string[];
}

const formatUrl = (url: string): string => {
  if (!url) return '';
  
  // Add https:// if no protocol is specified
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  
  // Remove trailing slashes
  return url.replace(/\/+$/, '');
};

export const BulkAnalyzeButton = ({ selectedIds }: BulkAnalyzeButtonProps) => {
  const analyzeLeads = async () => {
    try {
      // Get leads with websites (either all or selected)
      const query = supabase
        .from('leads')
        .select('id, company_website')
        .not('company_website', 'is', null);

      if (selectedIds.length > 0) {
        query.in('id', selectedIds);
      }

      const { data: leads, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      if (!leads || leads.length === 0) {
        toast.info("No leads with websites found");
        return;
      }

      toast.info(`Starting analysis for ${leads.length} leads...`);

      // Update all leads to pending status
      await supabase
        .from('leads')
        .update({
          scraping_status: 'pending',
          last_scrape_attempt: new Date().toISOString()
        })
        .in('id', leads.map(l => l.id));

      // Process each lead
      for (const lead of leads) {
        if (lead.company_website) {
          const formattedUrl = formatUrl(lead.company_website);
          if (!formattedUrl) {
            console.error(`Invalid URL for lead ${lead.id}: ${lead.company_website}`);
            continue;
          }

          await supabase.functions.invoke('chat-with-data', {
            body: {
              action: 'analyze_company',
              leadId: lead.id,
              websiteUrl: formattedUrl,
            },
          });
        }
      }

      toast.success(`Analysis started for ${leads.length} leads`);
    } catch (error) {
      console.error('Error analyzing leads:', error);
      toast.error("Failed to start analysis");
    }
  };

  return (
    <Button
      variant="outline"
      onClick={analyzeLeads}
      className="gap-2"
    >
      <RefreshCw className="h-4 w-4" />
      {selectedIds.length > 0 ? 'Analyze Selected Leads' : 'Analyze All Leads'}
    </Button>
  );
};