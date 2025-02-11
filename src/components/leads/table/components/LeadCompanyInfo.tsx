import { LeadCompanyInfoProps } from "../../types/lead";

export const LeadCompanyInfo = ({ lead }: LeadCompanyInfoProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <p className="font-medium">{lead.company_name}</p>
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