import { LeadCompanyInfoProps } from "../../types/lead";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info } from "lucide-react";

export const LeadCompanyInfo = ({ lead }: LeadCompanyInfoProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <p className="font-medium">{lead.company_name}</p>
        {lead.ai_summary && (
          <HoverCard>
            <HoverCardTrigger>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <p className="text-sm">{lead.ai_summary}</p>
            </HoverCardContent>
          </HoverCard>
        )}
        {lead.scraping_status && lead.scraping_status !== 'completed' && (
          <Badge variant={lead.scraping_status === 'failed' ? 'destructive' : 'secondary'}>
            {lead.scraping_status}
          </Badge>
        )}
      </div>
      {lead.company_website && (
        <a
          href={lead.company_website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:text-purple-700 hover:underline text-sm"
        >
          Visit Website
        </a>
      )}
    </div>
  );
};